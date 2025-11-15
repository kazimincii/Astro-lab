import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from '@/entities/subscription.entity';
import { User } from '@/entities/user.entity';
import { PersonProfile } from '@/entities/person-profile.entity';
import { ActionsModule } from '../actions/actions.module';
import { StripeService } from './stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User, PersonProfile]), ActionsModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, StripeService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
