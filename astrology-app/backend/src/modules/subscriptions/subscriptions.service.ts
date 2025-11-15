import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionPlan } from '@/entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
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
    });

    return this.subscriptionsRepository.save(subscription);
  }

  async getCurrentSubscription(userId: string) {
    return this.subscriptionsRepository.findOne({
      where: { user: { id: userId }, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }
}
