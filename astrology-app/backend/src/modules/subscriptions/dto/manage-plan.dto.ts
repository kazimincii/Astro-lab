import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan } from '@/entities/subscription.entity';
import { BillingCycle, BILLING_CYCLES } from '../plan.config';

export class ChangePlanDto {
  @ApiProperty({
    description: 'Subscription plan to upgrade to',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.STANDARD,
    enumName: 'SubscriptionPlan',
  })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @ApiProperty({
    description: 'Billing cycle for the subscription',
    enum: ['monthly', 'yearly'],
    example: 'monthly',
  })
  @IsIn(BILLING_CYCLES)
  billingCycle: BillingCycle;
}

export class StartTrialDto {
  @ApiProperty({
    description: 'Plan to start trial for (Standard or Premium only)',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.STANDARD,
    enumName: 'SubscriptionPlan',
  })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}

export class CancelSubscriptionDto {
  @ApiPropertyOptional({
    description: 'Optional reason for cancellation',
    example: 'Too expensive for my needs',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
