import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { ActionLog, ActionType } from '../../entities/action-log.entity';
import { Subscription, PlanType, SubscriptionStatus } from '../../entities/subscription.entity';
import { Trial, TrialStatus } from '../../entities/trial.entity';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(ActionLog)
    private actionsRepository: Repository<ActionLog>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Trial)
    private trialRepository: Repository<Trial>,
  ) {}

  async logAction(userId: string, actionType: ActionType, metadata?: any) {
    const action = this.actionsRepository.create({
      user: { id: userId } as any,
      actionType,
      actionDate: new Date(),
      metadata,
    });

    return this.actionsRepository.save(action);
  }

  async getTodayActionsCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.actionsRepository.count({
      where: {
        user: { id: userId },
        actionDate: MoreThanOrEqual(today),
        isPremiumAction: true,
      },
    });
  }

  async getDailyLimit(planType: PlanType): Promise<number> {
    const limits = {
      [PlanType.BASIC]: 2,
      [PlanType.STANDARD]: 4,
      [PlanType.PREMIUM]: 0, // 0 = unlimited
    };

    return limits[planType] || 2;
  }

  async getUserPlan(userId: string): Promise<PlanType> {
    // Check for active trial first
    const activeTrial = await this.trialRepository.findOne({
      where: { userId, status: TrialStatus.ACTIVE },
    });

    if (activeTrial && new Date() <= activeTrial.endDate) {
      return activeTrial.planType;
    }

    // Check for active subscription
    const activeSubscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    if (activeSubscription) {
      return activeSubscription.planType;
    }

    // Default to Basic
    return PlanType.BASIC;
  }

  async checkAndConsumeAction(userId: string): Promise<void> {
    const planType = await this.getUserPlan(userId);
    const dailyLimit = await this.getDailyLimit(planType);

    // Premium plan has unlimited actions
    if (dailyLimit === 0) {
      await this.logAction(userId, ActionType.PREMIUM_ACTION, { unlimited: true });
      return;
    }

    const todayCount = await this.getTodayActionsCount(userId);

    if (todayCount >= dailyLimit) {
      throw new ForbiddenException({
        message: 'Daily action limit reached',
        currentCount: todayCount,
        dailyLimit,
        planType,
        suggestUpgrade: planType === PlanType.BASIC ? 'standard' : 'premium',
      });
    }

    // Log the action
    await this.logAction(userId, ActionType.PREMIUM_ACTION);
  }

  async getRemainingActions(userId: string): Promise<{ used: number; limit: number; remaining: number; planType: PlanType; dailyLimit: number }> {
    const planType = await this.getUserPlan(userId);
    const dailyLimit = await this.getDailyLimit(planType);
    const todayCount = await this.getTodayActionsCount(userId);

    return {
      used: todayCount,
      limit: dailyLimit,
      dailyLimit,
      planType,
      remaining: dailyLimit === 0 ? -1 : Math.max(0, dailyLimit - todayCount), // -1 means unlimited
    };
  }

  async getUserActions(userId: string, startDate?: Date, endDate?: Date): Promise<ActionLog[]> {
    const query: any = { userId };

    if (startDate || endDate) {
      query.actionDate = {};
      if (startDate) query.actionDate.$gte = startDate;
      if (endDate) query.actionDate.$lte = endDate;
    }

    return this.actionsRepository.find({
      where: query,
      order: { createdAt: 'DESC' },
    });
  }
}
