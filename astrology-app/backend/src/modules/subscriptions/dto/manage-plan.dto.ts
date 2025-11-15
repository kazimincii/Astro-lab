import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { SubscriptionPlan } from '@/entities/subscription.entity';
import { BillingCycle, BILLING_CYCLES } from '../plan.config';

export class ChangePlanDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsIn(BILLING_CYCLES)
  billingCycle: BillingCycle;
}

export class StartTrialDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}

export class CancelSubscriptionDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
