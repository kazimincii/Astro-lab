import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from '@/entities/subscription.entity';
import { Trial } from '@/entities/trial.entity';
import { SubscriptionPlanConfig } from '@/entities/subscription-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Trial, SubscriptionPlanConfig])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
