import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '@/entities/subscription.entity';
import { Trial, TrialStatus } from '@/entities/trial.entity';
import { SubscriptionPlanConfig, PlanType } from '@/entities/subscription-plan.entity';

export interface EffectivePlan {
  planType: PlanType;
  source: 'trial' | 'subscription' | 'default';
  dailyActionLimit: number;
  maxProfiles: number;
  unlimitedActions: boolean;
  features: {
    hasFullChartInterpretation: boolean;
    hasAdvancedCharts: boolean;
    hasFullForecasts: boolean;
    hasUnlimitedTarot: boolean;
    hasCoffeeReading: boolean;
    hasFullNumerology: boolean;
    hasBiorhythm: boolean;
    hasChakraAnalysis: boolean;
    hasCalendars: boolean;
    hasAstroMap: boolean;
    hasFamousPeople: boolean;
    hasSoulmateMatching: boolean;
    hasAuraScan: boolean;
    hasJournaling: boolean;
    hasLiveServices: boolean;
    hasProMode: boolean;
  };
}

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(Trial)
    private trialsRepository: Repository<Trial>,
    @InjectRepository(SubscriptionPlanConfig)
    private planConfigRepository: Repository<SubscriptionPlanConfig>,
  ) {}

  async createBasicSubscription(userId: string) {
    const subscription = this.subscriptionsRepository.create({
      user: { id: userId } as any,
      plan: SubscriptionPlan.BASIC,
      price: 0,
      billingCycle: 'monthly',
      startDate: new Date(),
      endDate: new Date('2099-12-31'),
      dailyActionLimit: 2,
      profileLimit: 2,
      unlimitedActions: false,
      status: SubscriptionStatus.ACTIVE,
    });

    return this.subscriptionsRepository.save(subscription);
  }

  async getCurrentSubscription(userId: string) {
    return this.subscriptionsRepository.findOne({
      where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Effective Plan Resolver
   * Returns the user's current effective plan by checking:
   * 1. Active trial (highest priority)
   * 2. Active paid subscription
   * 3. Default to Basic (free)
   */
  async getEffectivePlan(userId: string): Promise<EffectivePlan> {
    // Check for active trial first
    const activeTrial = await this.trialsRepository.findOne({
      where: { userId, status: TrialStatus.ACTIVE },
    });

    if (activeTrial && new Date() <= activeTrial.endDate) {
      const planConfig = await this.planConfigRepository.findOne({
        where: { planType: activeTrial.planType as PlanType },
      });

      return this.buildEffectivePlan(activeTrial.planType as PlanType, 'trial', planConfig);
    }

    // Check for active subscription
    const activeSubscription = await this.getCurrentSubscription(userId);

    if (activeSubscription) {
      const planConfig = await this.planConfigRepository.findOne({
        where: { planType: activeSubscription.plan as PlanType },
      });

      return this.buildEffectivePlan(activeSubscription.plan as PlanType, 'subscription', planConfig);
    }

    // Default to Basic
    const basicConfig = await this.planConfigRepository.findOne({
      where: { planType: PlanType.BASIC },
    });

    return this.buildEffectivePlan(PlanType.BASIC, 'default', basicConfig);
  }

  private buildEffectivePlan(
    planType: PlanType,
    source: 'trial' | 'subscription' | 'default',
    config: SubscriptionPlanConfig | null,
  ): EffectivePlan {
    // Fallback defaults if config not found
    const defaults = {
      [PlanType.BASIC]: { dailyActionLimit: 2, maxProfiles: 2, unlimitedActions: false },
      [PlanType.STANDARD]: { dailyActionLimit: 4, maxProfiles: 10, unlimitedActions: false },
      [PlanType.PREMIUM]: { dailyActionLimit: 0, maxProfiles: 50, unlimitedActions: true },
    };

    const fallback = defaults[planType] || defaults[PlanType.BASIC];

    return {
      planType,
      source,
      dailyActionLimit: config?.dailyActionLimit ?? fallback.dailyActionLimit,
      maxProfiles: config?.maxProfiles ?? fallback.maxProfiles,
      unlimitedActions: config?.unlimitedActions ?? fallback.unlimitedActions,
      features: {
        hasFullChartInterpretation: config?.hasFullChartInterpretation ?? false,
        hasAdvancedCharts: config?.hasAdvancedCharts ?? false,
        hasFullForecasts: config?.hasFullForecasts ?? false,
        hasUnlimitedTarot: config?.hasUnlimitedTarot ?? false,
        hasCoffeeReading: config?.hasCoffeeReading ?? false,
        hasFullNumerology: config?.hasFullNumerology ?? false,
        hasBiorhythm: config?.hasBiorhythm ?? false,
        hasChakraAnalysis: config?.hasChakraAnalysis ?? false,
        hasCalendars: config?.hasCalendars ?? false,
        hasAstroMap: config?.hasAstroMap ?? false,
        hasFamousPeople: config?.hasFamousPeople ?? false,
        hasSoulmateMatching: config?.hasSoulmateMatching ?? false,
        hasAuraScan: config?.hasAuraScan ?? false,
        hasJournaling: config?.hasJournaling ?? false,
        hasLiveServices: config?.hasLiveServices ?? false,
        hasProMode: config?.hasProMode ?? false,
      },
    };
  }

  async createPaidSubscription(
    userId: string,
    planType: PlanType,
    billingCycle: 'monthly' | 'yearly',
    stripeCustomerId?: string,
    stripeSubscriptionId?: string,
  ): Promise<Subscription> {
    const planConfig = await this.planConfigRepository.findOne({
      where: { planType },
    });

    if (!planConfig) {
      throw new Error('Plan configuration not found');
    }

    const price = billingCycle === 'monthly' ? planConfig.monthlyPrice : planConfig.yearlyPrice;
    const startDate = new Date();
    const endDate = new Date();

    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = this.subscriptionsRepository.create({
      user: { id: userId } as any,
      plan: planType as SubscriptionPlan,
      price: Number(price),
      billingCycle,
      startDate,
      endDate,
      dailyActionLimit: planConfig.dailyActionLimit,
      profileLimit: planConfig.maxProfiles,
      unlimitedActions: planConfig.unlimitedActions,
      status: SubscriptionStatus.ACTIVE,
      stripeCustomerId,
      stripeSubscriptionId,
      autoRenew: true,
    });

    return this.subscriptionsRepository.save(subscription);
  }

  async cancelSubscription(userId: string, reason?: string): Promise<Subscription> {
    const subscription = await this.getCurrentSubscription(userId);

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;
    subscription.autoRenew = false;

    return this.subscriptionsRepository.save(subscription);
  }
}
