import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, PlanType, BillingPeriod, SubscriptionStatus } from '../../entities/subscription.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    const apiKey = this.configService.get<string>('stripe.apiKey');
    if (!apiKey) {
      this.logger.warn('Stripe API key not configured');
    }
    this.stripe = new Stripe(apiKey || '', {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(
    userId: string,
    planType: PlanType,
    billingPeriod: BillingPeriod,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ sessionId: string; url: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Get price ID based on plan and billing period
    const priceId = this.getPriceId(planType, billingPeriod);

    try {
      const session = await this.stripe.checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: userId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          planType,
          billingPeriod,
        },
        subscription_data: {
          metadata: {
            userId,
            planType,
            billingPeriod,
          },
        },
      });

      return {
        sessionId: session.id,
        url: session.url!,
      };
    } catch (error) {
      this.logger.error('Failed to create checkout session', error);
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  /**
   * Create a portal session for managing subscription
   */
  async createPortalSession(userId: string, returnUrl: string): Promise<{ url: string }> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      throw new BadRequestException('No active subscription found');
    }

    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: returnUrl,
      });

      return { url: session.url };
    } catch (error) {
      this.logger.error('Failed to create portal session', error);
      throw new BadRequestException('Failed to create portal session');
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(signature: string, payload: Buffer): Promise<void> {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret!);
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error);
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new BadRequestException('No active subscription found');
    }

    try {
      await this.stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.cancelledAt = new Date();
      await this.subscriptionRepository.save(subscription);

      this.logger.log(`Subscription cancelled for user ${userId}`);
    } catch (error) {
      this.logger.error('Failed to cancel subscription', error);
      throw new BadRequestException('Failed to cancel subscription');
    }
  }

  /**
   * Get price ID from config
   */
  private getPriceId(planType: PlanType, billingPeriod: BillingPeriod): string {
    const prices = this.configService.get('stripe.prices');

    if (planType === PlanType.STANDARD) {
      return billingPeriod === BillingPeriod.MONTHLY
        ? prices.standard.monthly
        : prices.standard.yearly;
    } else if (planType === PlanType.PREMIUM) {
      return billingPeriod === BillingPeriod.MONTHLY
        ? prices.premium.monthly
        : prices.premium.yearly;
    }

    throw new BadRequestException('Invalid plan type');
  }

  /**
   * Handle checkout session completed
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType as PlanType;
    const billingPeriod = session.metadata?.billingPeriod as BillingPeriod;

    if (!userId || !planType || !billingPeriod) {
      this.logger.error('Missing metadata in checkout session');
      return;
    }

    // Subscription will be created by the subscription.created webhook
    // This event confirms the checkout was successful
    this.logger.log(`Checkout completed for user ${userId}, plan ${planType}`);
  }

  /**
   * Handle subscription created
   */
  private async handleSubscriptionCreated(stripeSubscription: Stripe.Subscription): Promise<void> {
    const userId = stripeSubscription.metadata?.userId;
    const planType = stripeSubscription.metadata?.planType as PlanType;
    const billingPeriod = stripeSubscription.metadata?.billingPeriod as BillingPeriod;

    if (!userId || !planType || !billingPeriod) {
      this.logger.error('Missing metadata in subscription');
      return;
    }

    // Cancel any existing active subscriptions
    await this.subscriptionRepository.update(
      { userId, status: SubscriptionStatus.ACTIVE },
      { status: SubscriptionStatus.CANCELLED, cancelledAt: new Date() },
    );

    // Create new subscription
    const subscription = this.subscriptionRepository.create({
      userId,
      plan: planType,
      planType,
      billingPeriod,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(stripeSubscription.current_period_start * 1000),
      endDate: new Date(stripeSubscription.current_period_end * 1000),
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: stripeSubscription.customer as string,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    });

    await this.subscriptionRepository.save(subscription);
    this.logger.log(`Subscription created for user ${userId}`);
  }

  /**
   * Handle subscription updated
   */
  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) {
      this.logger.warn(`Subscription not found: ${stripeSubscription.id}`);
      return;
    }

    // Update subscription details
    subscription.status = stripeSubscription.status as any;
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);

    if (stripeSubscription.cancel_at_period_end) {
      subscription.cancelAtPeriodEnd = true;
    }

    await this.subscriptionRepository.save(subscription);
    this.logger.log(`Subscription updated: ${stripeSubscription.id}`);
  }

  /**
   * Handle subscription deleted
   */
  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) {
      this.logger.warn(`Subscription not found: ${stripeSubscription.id}`);
      return;
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    await this.subscriptionRepository.save(subscription);

    this.logger.log(`Subscription deleted: ${stripeSubscription.id}`);
  }

  /**
   * Handle invoice payment succeeded
   */
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.subscription as string;

    if (!subscriptionId) {
      return;
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (subscription) {
      this.logger.log(`Payment succeeded for subscription: ${subscriptionId}`);
      // Could send receipt email or update payment history here
    }
  }

  /**
   * Handle invoice payment failed
   */
  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.subscription as string;

    if (!subscriptionId) {
      return;
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (subscription) {
      this.logger.warn(`Payment failed for subscription: ${subscriptionId}`);
      // Could send payment failure notification here
    }
  }

  /**
   * Get upcoming invoice
   */
  async getUpcomingInvoice(userId: string): Promise<any> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new BadRequestException('No active subscription found');
    }

    try {
      const invoice = await this.stripe.invoices.retrieveUpcoming({
        subscription: subscription.stripeSubscriptionId,
      });

      return {
        amountDue: invoice.amount_due / 100, // Convert from cents
        currency: invoice.currency,
        periodStart: new Date(invoice.period_start * 1000),
        periodEnd: new Date(invoice.period_end * 1000),
      };
    } catch (error) {
      this.logger.error('Failed to retrieve upcoming invoice', error);
      throw new BadRequestException('Failed to retrieve upcoming invoice');
    }
  }
}
