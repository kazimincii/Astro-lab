import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, addMonths, addYears } from 'date-fns';
import { In, Repository } from 'typeorm';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  BillingPeriod,
} from '@/entities/subscription.entity';
import { User } from '@/entities/user.entity';
import { PersonProfile } from '@/entities/person-profile.entity';
import { ActionsService } from '../actions/actions.service';
import { ActionType } from '@/entities/action-log.entity';
import {
  PLAN_DEFINITIONS,
  BillingCycle,
  getPlanDefinition,
  isPaidPlan,
  TRIAL_DAYS,
} from './plan.config';
import { StripeService } from './stripe.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PersonProfile)
    private profilesRepository: Repository<PersonProfile>,
    private actionsService: ActionsService,
    private stripeService: StripeService,
  ) {}

  async listPlans() {
    return Object.values(PLAN_DEFINITIONS).map(plan => ({
      plan: plan.key,
      label: plan.label,
      description: plan.description,
      trialEligible: plan.trialEligible,
      features: plan.features,
      prices: plan.prices,
      dailyActionLimit: plan.dailyActionLimit,
      profileLimit: plan.profileLimit,
      unlimitedActions: plan.unlimitedActions,
    }));
  }

  async createBasicSubscription(userId: string) {
    const definition = getPlanDefinition(SubscriptionPlan.BASIC);
    const start = new Date();
    const end = new Date('2099-12-31');
    const subscription = await this.subscriptionsRepository.save(
      this.subscriptionsRepository.create({
        user: { id: userId } as any,
        userId,
        plan: SubscriptionPlan.BASIC,
        planType: SubscriptionPlan.BASIC,
        price: definition.prices.monthly,
        billingPeriod: BillingPeriod.MONTHLY,
        startDate: start,
        endDate: end,
        nextBillingDate: end,
        dailyActionLimit: definition.dailyActionLimit,
        profileLimit: definition.profileLimit,
        unlimitedActions: definition.unlimitedActions,
        status: SubscriptionStatus.ACTIVE,
        autoRenew: true,
      }),
    );

    await this.setCurrentSubscription(userId, subscription.id);
    return subscription;
  }

  async ensureDefaultSubscription(userId: string) {
    const current = await this.getCurrentSubscription(userId);
    if (current) {
      return current;
    }

    const basic = await this.subscriptionsRepository.findOne({
      where: {
        user: { id: userId },
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (basic) {
      await this.setCurrentSubscription(userId, basic.id);
      return basic;
    }

    return this.createBasicSubscription(userId);
  }

  async getCurrentSubscription(userId: string) {
    return this.subscriptionsRepository.findOne({
      where: {
        user: { id: userId },
        status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL]),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getUsageSummary(userId: string) {
    const subscription = await this.ensureDefaultSubscription(userId);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    const [actionsUsed, profileCount] = await Promise.all([
      this.actionsService.countPremiumActionsBetween(userId, todayStart, todayEnd),
      this.profilesRepository.count({
        where: { owner: { id: userId } },
      }),
    ]);

    const definition = getPlanDefinition(subscription.plan);
    const remainingActions = subscription.unlimitedActions
      ? null
      : Math.max(subscription.dailyActionLimit - actionsUsed, 0);

    return {
      plan: subscription.plan,
      planLabel: definition.label,
      dailyActionLimit: subscription.dailyActionLimit,
      unlimitedActions: subscription.unlimitedActions,
      profileLimit: subscription.profileLimit,
      actionsUsedToday: actionsUsed,
      actionsRemaining: subscription.unlimitedActions ? null : remainingActions,
      profilesUsed: profileCount,
      trialEndsAt: subscription.trialEndsAt,
      nextBillingDate: subscription.nextBillingDate,
      features: definition.features,
    };
  }

  async consumePremiumAction(
    userId: string,
    actionType: ActionType,
    metadata?: any,
    description?: string,
  ) {
    const subscription = await this.ensureDefaultSubscription(userId);
    if (!subscription.unlimitedActions) {
      const used = await this.actionsService.getTodayActionsCount(userId);
      if (used >= subscription.dailyActionLimit) {
        throw new BadRequestException(
          'Premium action limit reached for today. Upgrade your plan to continue.',
        );
      }
    }

    await this.actionsService.logPremiumAction(userId, actionType, metadata, description);
    return subscription;
  }

  async startTrial(userId: string, plan: SubscriptionPlan) {
    if (!isPaidPlan(plan)) {
      throw new BadRequestException('Trial is only available for paid plans.');
    }
    const definition = getPlanDefinition(plan);
    if (!definition.trialEligible) {
      throw new BadRequestException('Selected plan is not eligible for trial.');
    }

    const existingTrial = await this.subscriptionsRepository.findOne({
      where: {
        user: { id: userId },
        status: SubscriptionStatus.TRIAL,
      },
    });

    if (existingTrial) {
      throw new BadRequestException('You already have an active trial.');
    }

    await this.deactivatePaidSubscriptions(userId);

    const trialEnds = addDays(new Date(), TRIAL_DAYS);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['currentSubscription'],
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const { stripeCustomerId, stripeSubscriptionId } =
      await this.stripeService.syncSubscription({
        user,
        priceId: definition.stripePriceIds.monthly,
        currentCustomerId: user.currentSubscription?.stripeCustomerId,
        currentSubscriptionId: user.currentSubscription?.stripeSubscriptionId,
        trialEnd: trialEnds,
        metadata: { plan, type: 'trial' },
      });

    return this.createSubscriptionRecord(userId, plan, 'monthly', {
      status: SubscriptionStatus.TRIAL,
      trialEndsAt: trialEnds,
      isTrial: true,
      endDate: trialEnds,
      nextBillingDate: trialEnds,
      price: definition.prices.monthly,
      stripeSubscriptionId: stripeSubscriptionId ?? undefined,
      stripeCustomerId: stripeCustomerId ?? undefined,
      stripePriceId: definition.stripePriceIds.monthly ?? undefined,
    });
  }

  async changePlan(
    userId: string,
    plan: SubscriptionPlan,
    billingCycle: BillingCycle,
  ) {
    if (plan === SubscriptionPlan.BASIC) {
      await this.downgradeToBasic(userId);
      return this.ensureDefaultSubscription(userId);
    }

    const definition = getPlanDefinition(plan);
    await this.deactivatePaidSubscriptions(userId);

    const start = new Date();
    const end = this.calculateEndDate(start, billingCycle);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['currentSubscription'],
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const { stripeCustomerId, stripeSubscriptionId } =
      await this.stripeService.syncSubscription({
        user,
        priceId: definition.stripePriceIds[billingCycle],
        currentCustomerId: user.currentSubscription?.stripeCustomerId,
        currentSubscriptionId: user.currentSubscription?.stripeSubscriptionId,
        metadata: { plan, billingCycle },
      });

    return this.createSubscriptionRecord(userId, plan, billingCycle, {
      status: SubscriptionStatus.ACTIVE,
      startDate: start,
      endDate: end,
      nextBillingDate: end,
      isTrial: false,
      trialEndsAt: null,
      price: definition.prices[billingCycle],
      stripeSubscriptionId: stripeSubscriptionId ?? undefined,
      stripeCustomerId: stripeCustomerId ?? undefined,
      stripePriceId: definition.stripePriceIds[billingCycle] ?? undefined,
    });
  }

  async cancelSubscription(userId: string, reason?: string) {
    const current = await this.getCurrentSubscription(userId);
    if (!current || current.plan === SubscriptionPlan.BASIC) {
      throw new BadRequestException('No paid subscription to cancel.');
    }

    await this.subscriptionsRepository.update(current.id, {
      status: SubscriptionStatus.CANCELLED,
      cancellationReason: reason,
      cancelledAt: new Date(),
      autoRenew: false,
    });

    await this.stripeService.cancelSubscription(current.stripeSubscriptionId);
    return this.ensureDefaultSubscription(userId);
  }

  async downgradeToBasic(userId: string) {
    const current = await this.getCurrentSubscription(userId);
    if (!current || current.plan === SubscriptionPlan.BASIC) {
      return this.ensureDefaultSubscription(userId);
    }
    return this.cancelSubscription(userId, 'Downgraded to Basic');
  }

  private async deactivatePaidSubscriptions(userId: string) {
    const subscriptions = await this.subscriptionsRepository.find({
      where: {
        user: { id: userId },
        plan: In([SubscriptionPlan.STANDARD, SubscriptionPlan.PREMIUM]),
        status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL]),
      },
    });

    for (const subscription of subscriptions) {
      await this.subscriptionsRepository.update(subscription.id, {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
        autoRenew: false,
      });
      await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);
    }
  }

  private async createSubscriptionRecord(
    userId: string,
    plan: SubscriptionPlan,
    billingCycle: BillingCycle,
    overrides: Partial<Subscription>,
  ) {
    const definition = getPlanDefinition(plan);
    const startDate = overrides.startDate ?? new Date();
    const endDate =
      overrides.endDate ??
      (plan === SubscriptionPlan.BASIC
        ? new Date('2099-12-31')
        : this.calculateEndDate(startDate, billingCycle));

    const subscription = this.subscriptionsRepository.create({
      user: { id: userId } as any,
      userId,
      plan,
      planType: plan,
      billingPeriod: billingCycle === 'monthly' ? BillingPeriod.MONTHLY : BillingPeriod.YEARLY,
      price: overrides.price ?? definition.prices[billingCycle],
      startDate,
      endDate,
      nextBillingDate: overrides.nextBillingDate ?? endDate,
      dailyActionLimit: definition.dailyActionLimit,
      profileLimit: definition.profileLimit,
      unlimitedActions: definition.unlimitedActions,
      status: overrides.status ?? SubscriptionStatus.ACTIVE,
      autoRenew: overrides.autoRenew ?? true,
      trialEndsAt: overrides.trialEndsAt ?? null,
      isTrial: overrides.isTrial ?? false,
      stripeSubscriptionId: overrides.stripeSubscriptionId ?? null,
      stripeCustomerId: overrides.stripeCustomerId ?? null,
      stripePriceId: overrides.stripePriceId ?? null,
      cancelledAt: overrides.cancelledAt ?? null,
      cancellationReason: overrides.cancellationReason ?? null,
    });

    const saved = await this.subscriptionsRepository.save(subscription) as Subscription;
    await this.setCurrentSubscription(userId, saved.id);
    return saved;
  }

  private calculateEndDate(start: Date, billingCycle: BillingCycle) {
    if (billingCycle === 'monthly') {
      return addMonths(start, 1);
    }
    return addYears(start, 1);
  }

  private async setCurrentSubscription(userId: string, subscriptionId: string) {
    await this.usersRepository.update(userId, {
      currentSubscription: { id: subscriptionId } as any,
    });
  }
}
