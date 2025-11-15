import { IsEnum, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanType, BillingPeriod } from '../../../entities/subscription.entity';

export class CreateCheckoutDto {
  @ApiProperty({
    description: 'Subscription plan type',
    enum: PlanType,
    example: PlanType.STANDARD,
    enumName: 'PlanType',
  })
  @IsEnum(PlanType)
  planType: PlanType;

  @ApiProperty({
    description: 'Billing period (monthly or yearly)',
    enum: BillingPeriod,
    example: BillingPeriod.MONTHLY,
    enumName: 'BillingPeriod',
  })
  @IsEnum(BillingPeriod)
  billingPeriod: BillingPeriod;

  @ApiProperty({
    description: 'URL to redirect after successful payment',
    example: 'https://app.example.com/success',
    format: 'uri',
  })
  @IsUrl()
  successUrl: string;

  @ApiProperty({
    description: 'URL to redirect if payment is cancelled',
    example: 'https://app.example.com/cancel',
    format: 'uri',
  })
  @IsUrl()
  cancelUrl: string;
}

export class CreatePortalDto {
  @ApiProperty({
    description: 'URL to return to after portal session',
    example: 'https://app.example.com/account',
    format: 'uri',
  })
  @IsUrl()
  returnUrl: string;
}
