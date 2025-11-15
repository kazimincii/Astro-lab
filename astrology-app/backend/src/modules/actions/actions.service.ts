import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ActionLog, ActionType } from '@/entities/action-log.entity';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '@/entities/subscription.entity';
import { Trial, TrialStatus } from '@/entities/trial.entity';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(ActionLog)
    private actionsRepository: Repository<ActionLog>,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(Trial)
    private trialsRepository: Repository<Trial>,
  ) {}

  async logAction(
    userId: string,
    actionType: ActionType,
    metadata?: any,
    options: { isPremium?: boolean; description?: string } = {},
  ) {
    const { isPremium = false, description } = options;
    const actionDate = this.normalizeDate(new Date());

    const action = this.actionsRepository.create({
      user: { id: userId } as any,
      actionType,
      actionDate,
      metadata,
      description,
      isPremiumAction: isPremium,
    });

    return this.actionsRepository.save(action);
  }

  async logPremiumAction(
    userId: string,
    actionType: ActionType,
    metadata?: any,
    description?: string,
  ) {
    return this.logAction(userId, actionType, metadata, {
      isPremium: true,
      description,
    });
  }

  async getTodayActionsCount(userId: string): Promise<number> {
    const start = this.normalizeDate(new Date());
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    return this.countPremiumActionsBetween(userId, start, end);
  }

  async countPremiumActionsBetween(userId: string, start: Date, end: Date): Promise<number> {
    return this.actionsRepository.count({
      where: {
        user: { id: userId },
        isPremiumAction: true,
        actionDate: Between(start, end),
      },
    });
  }

  private normalizeDate(date: Date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  async getUserPlan(userId: string): Promise<SubscriptionPlan> {
    // Check for active subscription
    const subscription = await this.subscriptionsRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (subscription) {
      return subscription.plan;
    }

    // Check for active trial
    const trial = await this.trialsRepository.findOne({
      where: {
        userId,
        status: TrialStatus.ACTIVE,
      },
    });

    if (trial && trial.premiumActionsRemaining > 0) {
      return SubscriptionPlan.STANDARD; // Trials get standard features
    }

    return SubscriptionPlan.BASIC;
  }

  async getRemainingActions(userId: string): Promise<{
    plan: SubscriptionPlan;
    limit: number;
    used: number;
    remaining: number;
    isTrial: boolean;
  }> {
    const plan = await this.getUserPlan(userId);

    // Check if on trial
    const trial = await this.trialsRepository.findOne({
      where: {
        userId,
        status: TrialStatus.ACTIVE,
      },
    });

    if (trial) {
      return {
        plan,
        limit: trial.premiumActionsTotal,
        used: trial.premiumActionsTotal - trial.premiumActionsRemaining,
        remaining: trial.premiumActionsRemaining,
        isTrial: true,
      };
    }

    // Get plan limits
    const limits: Record<SubscriptionPlan, number> = {
      [SubscriptionPlan.BASIC]: 2,
      [SubscriptionPlan.STANDARD]: 4,
      [SubscriptionPlan.PREMIUM]: 999999, // Unlimited
    };

    const limit = limits[plan];
    const used = await this.getTodayActionsCount(userId);
    const remaining = Math.max(0, limit - used);

    return {
      plan,
      limit,
      used,
      remaining,
      isTrial: false,
    };
  }

  async checkAndConsumeAction(userId: string): Promise<void> {
    const { remaining, plan, isTrial } = await this.getRemainingActions(userId);

    if (remaining <= 0) {
      throw new ForbiddenException(
        `Daily premium action limit reached. Upgrade to ${
          plan === SubscriptionPlan.BASIC ? 'Standard or Premium' : 'Premium'
        } plan for more actions.`,
      );
    }

    // If on trial, decrement trial actions
    if (isTrial) {
      const trial = await this.trialsRepository.findOne({
        where: {
          userId,
          status: TrialStatus.ACTIVE,
        },
      });

      if (trial) {
        trial.premiumActionsRemaining -= 1;
        if (trial.premiumActionsRemaining <= 0) {
          trial.status = TrialStatus.EXPIRED;
        }
        await this.trialsRepository.save(trial);
      }
    }
    // Premium action count is tracked via logPremiumAction calls
  }
}
