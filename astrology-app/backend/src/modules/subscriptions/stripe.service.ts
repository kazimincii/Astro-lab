import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { User } from '@/entities/user.entity';

interface SyncParams {
  user: User;
  priceId?: string | null;
  currentCustomerId?: string | null;
  currentSubscriptionId?: string | null;
  trialEnd?: Date | null;
  metadata?: Record<string, string | number>;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe | null;

  constructor(private configService: ConfigService) {
    const secret =
      this.configService.get<string>('stripe.secretKey') ||
      process.env.STRIPE_SECRET_KEY;
    this.stripe = secret
      ? new Stripe(secret, {
          apiVersion: '2023-10-16',
        })
      : null;
  }

  isEnabled() {
    return Boolean(this.stripe);
  }

  async syncSubscription({
    user,
    priceId,
    currentCustomerId,
    currentSubscriptionId,
    trialEnd,
    metadata,
  }: SyncParams) {
    if (!this.stripe || !priceId) {
      return {
        stripeCustomerId: currentCustomerId ?? null,
        stripeSubscriptionId: currentSubscriptionId ?? null,
      };
    }

    try {
      const normalizedMetadata = metadata
        ? this.normalizeMetadata(metadata)
        : undefined;
      const customerId =
        currentCustomerId ??
        (await this.createCustomer(user).catch(error => {
          this.logger.error('Stripe create customer failed', error.stack);
          return null;
        }));

      if (!customerId) {
        return { stripeCustomerId: null, stripeSubscriptionId: null };
      }

      const trialEndTimestamp =
        trialEnd && trialEnd > new Date()
          ? Math.floor(trialEnd.getTime() / 1000)
          : undefined;

      if (currentSubscriptionId) {
        const existing = await this.stripe.subscriptions.retrieve(
          currentSubscriptionId,
        );

        const subscription = await this.stripe.subscriptions.update(
          currentSubscriptionId,
          {
            cancel_at_period_end: false,
            items: existing.items.data[0]?.id
              ? [
                  {
                    id: existing.items.data[0]?.id,
                    price: priceId,
                  },
                ]
              : [{ price: priceId }],
            trial_end: trialEndTimestamp,
            metadata: normalizedMetadata,
            proration_behavior: 'create_prorations',
          },
        );

        return {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
        };
      }

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_end: trialEndTimestamp,
        metadata: normalizedMetadata,
      });

      return {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
      };
    } catch (error) {
      this.logger.error('Stripe subscription sync failed', error.stack);
      return { stripeCustomerId: null, stripeSubscriptionId: null };
    }
  }

  async cancelSubscription(stripeSubscriptionId?: string | null) {
    if (!this.stripe || !stripeSubscriptionId) {
      return;
    }

    try {
      await this.stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    } catch (error) {
      this.logger.error('Stripe cancel subscription failed', error.stack);
    }
  }

  private async createCustomer(user: User) {
    if (!this.stripe) {
      return null;
    }
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: fullName || undefined,
      metadata: {
        userId: user.id,
      },
    });
    return customer.id;
  }

  private normalizeMetadata(metadata: Record<string, string | number>) {
    return Object.entries(metadata).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {},
    );
  }
}
