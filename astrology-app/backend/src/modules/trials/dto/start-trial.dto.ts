import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan } from '../../../entities/subscription.entity';

export class StartTrialDto {
  @ApiProperty({
    description: 'Plan type for trial (Standard or Premium)',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.STANDARD,
    enumName: 'SubscriptionPlan',
  })
  @IsEnum(SubscriptionPlan)
  planType: SubscriptionPlan;
}
