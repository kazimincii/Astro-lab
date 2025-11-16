import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';

import { Subscription } from '@/entities/subscription.entity';
import { User } from '@/entities/user.entity';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16',
      });
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleStripeEvent(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      this.logger.warn('Stripe webhook secret not configured');
      throw new BadRequestException('Webhook not configured');
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    this.logger.log(`Received Stripe event: ${event.type}`);

    // Handle different event types
    try {
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(event.data.object as Stripe.Subscription);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
      throw error;
    }

    return { received: true };
  }

  /**
   * Handle subscription created event
   */
  private async handleSubscriptionCreated(stripeSubscription: Stripe.Subscription) {
    this.logger.log(`Subscription created: ${stripeSubscription.id}`);

    const userId = stripeSubscription.metadata?.userId;
    if (!userId) {
      this.logger.warn('No userId in subscription metadata');
      return;
    }

    const planType = this.getPlanTypeFromStripe(stripeSubscription);

    // Check if subscription already exists
    let subscription = await this.subscriptionsRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) {
      subscription = this.subscriptionsRepository.create({
        userId,
        planType,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeSubscription.customer as string,
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      });

      await this.subscriptionsRepository.save(subscription);
      this.logger.log(`Created subscription for user ${userId}`);
    }
  }

  /**
   * Handle subscription updated event
   */
  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    this.logger.log(`Subscription updated: ${stripeSubscription.id}`);

    const subscription = await this.subscriptionsRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) {
      this.logger.warn(`Subscription not found: ${stripeSubscription.id}`);
      return;
    }

    const planType = this.getPlanTypeFromStripe(stripeSubscription);

    // Update subscription
    subscription.planType = planType;
    subscription.status = stripeSubscription.status;
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

    await this.subscriptionsRepository.save(subscription);
    this.logger.log(`Updated subscription for user ${subscription.userId}`);
  }

  /**
   * Handle subscription deleted/cancelled event
   */
  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    this.logger.log(`Subscription deleted: ${stripeSubscription.id}`);

    const subscription = await this.subscriptionsRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) {
      this.logger.warn(`Subscription not found: ${stripeSubscription.id}`);
      return;
    }

    subscription.status = 'canceled';
    subscription.canceledAt = new Date();

    await this.subscriptionsRepository.save(subscription);
    this.logger.log(`Cancelled subscription for user ${subscription.userId}`);
  }

  /**
   * Handle successful payment
   */
  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    this.logger.log(`Invoice paid: ${invoice.id}`);

    if (!invoice.subscription) {
      return;
    }

    const subscription = await this.subscriptionsRepository.findOne({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (subscription) {
      subscription.lastPaymentDate = new Date(invoice.status_transitions.paid_at! * 1000);
      subscription.status = 'active';
      await this.subscriptionsRepository.save(subscription);
    }
  }

  /**
   * Handle failed payment
   */
  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    this.logger.log(`Invoice payment failed: ${invoice.id}`);

    if (!invoice.subscription) {
      return;
    }

    const subscription = await this.subscriptionsRepository.findOne({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (subscription) {
      subscription.status = 'past_due';
      await this.subscriptionsRepository.save(subscription);

      // TODO: Send notification to user about failed payment
      this.logger.warn(`Payment failed for user ${subscription.userId}`);
    }
  }

  /**
   * Handle trial ending soon
   */
  private async handleTrialWillEnd(stripeSubscription: Stripe.Subscription) {
    this.logger.log(`Trial will end soon: ${stripeSubscription.id}`);

    const subscription = await this.subscriptionsRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (subscription) {
      // TODO: Send notification to user about trial ending
      this.logger.log(`Trial ending soon for user ${subscription.userId}`);
    }
  }

  /**
   * Extract plan type from Stripe subscription
   */
  private getPlanTypeFromStripe(stripeSubscription: Stripe.Subscription): 'basic' | 'standard' | 'premium' {
    const priceId = stripeSubscription.items.data[0]?.price?.id;

    // Map Stripe price IDs to plan types
    // TODO: Get these from env or config
    if (priceId?.includes('premium')) {
      return 'premium';
    } else if (priceId?.includes('standard')) {
      return 'standard';
    }

    return 'basic';
  }
}
