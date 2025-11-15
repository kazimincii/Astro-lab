import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionPlan } from '@/entities/subscription.entity';
import { User } from '@/entities/user.entity';
import { PersonProfile } from '@/entities/person-profile.entity';
import { ActionsService } from '../actions/actions.service';
import { ActionType } from '@/entities/action-log.entity';

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
  ) {}

  async createBasicSubscription(userId: string) {
    const subscription = await this.subscriptionsRepository.save(
      this.subscriptionsRepository.create({
        user: { id: userId } as any,
        plan: SubscriptionPlan.BASIC,
        price: 0,
        billingCycle: 'monthly',
        startDate: new Date(),
        endDate: new Date('2099-12-31'),
        dailyActionLimit: 2,
        profileLimit: 2,
        unlimitedActions: false,
      }),
    );

    await this.setCurrentSubscription(userId, subscription.id);
    return subscription;
  }

  async ensureDefaultSubscription(userId: string) {
    const existing = await this.getCurrentSubscription(userId);
    if (existing) {
      return existing;
    }

    return this.createBasicSubscription(userId);
  }

  async getCurrentSubscription(userId: string) {
    return this.subscriptionsRepository.findOne({
      where: { user: { id: userId }, status: 'active' },
      order: { startDate: 'DESC' },
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

    const remainingActions = subscription.unlimitedActions
      ? null
      : Math.max(subscription.dailyActionLimit - actionsUsed, 0);

    return {
      plan: subscription.plan,
      dailyActionLimit: subscription.dailyActionLimit,
      unlimitedActions: subscription.unlimitedActions,
      profileLimit: subscription.profileLimit,
      actionsUsedToday: actionsUsed,
      actionsRemaining: subscription.unlimitedActions ? null : remainingActions,
      profilesUsed: profileCount,
    };
  }

  async consumePremiumAction(userId: string, actionType: ActionType, metadata?: any, description?: string) {
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

  private async setCurrentSubscription(userId: string, subscriptionId: string) {
    await this.usersRepository.update(userId, {
      currentSubscription: { id: subscriptionId } as any,
    });
  }
}
