import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CancelSubscriptionDto,
  ChangePlanDto,
  StartTrialDto,
} from './dto/manage-plan.dto';

@ApiTags('subscriptions')
@ApiBearerAuth('JWT-auth')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({
    summary: 'Get available subscription plans',
    description: 'Retrieve all available subscription plans with their features, pricing, and limits.',
  })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'standard' },
          label: { type: 'string', example: 'Standard' },
          description: { type: 'string', example: 'More daily actions, more profiles, deeper insights.' },
          trialEligible: { type: 'boolean', example: true },
          features: { type: 'array', items: { type: 'string' }, example: ['4 premium actions per day', 'Up to 10 profiles'] },
          dailyActionLimit: { type: 'number', example: 4 },
          profileLimit: { type: 'number', example: 10 },
          unlimitedActions: { type: 'boolean', example: false },
          prices: {
            type: 'object',
            properties: {
              monthly: { type: 'number', example: 10 },
              yearly: { type: 'number', example: 99 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPlans() {
    return this.subscriptionsService.listPlans();
  }

  @Get('current')
  @ApiOperation({
    summary: 'Get current subscription',
    description: 'Retrieve the authenticated user\'s current active subscription or trial details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current subscription retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        plan: { type: 'string', example: 'standard' },
        status: { type: 'string', example: 'active' },
        isTrial: { type: 'boolean', example: false },
        billingPeriod: { type: 'string', example: 'monthly' },
        price: { type: 'number', example: 10 },
        currentPeriodStart: { type: 'string', format: 'date-time' },
        currentPeriodEnd: { type: 'string', format: 'date-time' },
        cancelAtPeriodEnd: { type: 'boolean', example: false },
        dailyActionLimit: { type: 'number', example: 4 },
        profileLimit: { type: 'number', example: 10 },
        unlimitedActions: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active subscription found' })
  async getCurrentSubscription(@Request() req) {
    return this.subscriptionsService.getCurrentSubscription(req.user.id);
  }

  @Get('usage')
  @ApiOperation({
    summary: 'Get usage summary',
    description: 'Retrieve current usage statistics including action counts, remaining actions, and profile usage.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usage summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        plan: { type: 'string', example: 'standard' },
        dailyActionLimit: { type: 'number', example: 4 },
        actionsUsedToday: { type: 'number', example: 2 },
        actionsRemainingToday: { type: 'number', example: 2 },
        profileLimit: { type: 'number', example: 10 },
        profilesUsed: { type: 'number', example: 3 },
        profilesRemaining: { type: 'number', example: 7 },
        unlimitedActions: { type: 'boolean', example: false },
        isTrial: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUsage(@Request() req) {
    return this.subscriptionsService.getUsageSummary(req.user.id);
  }

  @Post('trial')
  @ApiOperation({
    summary: 'Start free trial',
    description: 'Start a 7-day free trial for Standard or Premium plan. Users can only start one trial per account.',
  })
  @ApiResponse({
    status: 201,
    description: 'Trial started successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        plan: { type: 'string', example: 'standard' },
        status: { type: 'string', example: 'trial' },
        isTrial: { type: 'boolean', example: true },
        trialEndsAt: { type: 'string', format: 'date-time' },
        dailyActionLimit: { type: 'number', example: 4 },
        profileLimit: { type: 'number', example: 10 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Trial not eligible for this plan or user already used trial' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User already has an active subscription or trial' })
  async startTrial(@Body() body: StartTrialDto, @Request() req) {
    return this.subscriptionsService.startTrial(req.user.id, body.plan);
  }

  @Post('upgrade')
  @ApiOperation({
    summary: 'Upgrade or change subscription plan',
    description: 'Upgrade to a higher tier plan or change billing cycle. Processes payment via Stripe and updates user subscription.',
  })
  @ApiResponse({
    status: 201,
    description: 'Plan changed successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        plan: { type: 'string', example: 'premium' },
        status: { type: 'string', example: 'active' },
        billingPeriod: { type: 'string', example: 'yearly' },
        price: { type: 'number', example: 189 },
        stripeSubscriptionId: { type: 'string', example: 'sub_1234567890' },
        currentPeriodStart: { type: 'string', format: 'date-time' },
        currentPeriodEnd: { type: 'string', format: 'date-time' },
        dailyActionLimit: { type: 'number', example: 999 },
        profileLimit: { type: 'number', example: 50 },
        unlimitedActions: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid plan or billing cycle' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 402, description: 'Payment required - Stripe payment failed' })
  async changePlan(@Body() body: ChangePlanDto, @Request() req) {
    return this.subscriptionsService.changePlan(
      req.user.id,
      body.plan,
      body.billingCycle,
    );
  }

  @Post('cancel')
  @ApiOperation({
    summary: 'Cancel subscription',
    description: 'Cancel the current active subscription. Subscription will remain active until the end of the current billing period.',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        plan: { type: 'string', example: 'standard' },
        status: { type: 'string', example: 'active' },
        cancelAtPeriodEnd: { type: 'boolean', example: true },
        cancelledAt: { type: 'string', format: 'date-time' },
        cancellationReason: { type: 'string', example: 'Too expensive for my needs' },
        currentPeriodEnd: { type: 'string', format: 'date-time' },
        message: { type: 'string', example: 'Subscription will be cancelled at the end of the current period' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active subscription found' })
  async cancelSubscription(
    @Body() body: CancelSubscriptionDto,
    @Request() req,
  ) {
    return this.subscriptionsService.cancelSubscription(
      req.user.id,
      body.reason,
    );
  }

  @Post('downgrade')
  @ApiOperation({
    summary: 'Downgrade to Basic plan',
    description: 'Immediately downgrade to the free Basic plan. Cancels any active paid subscription.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully downgraded to Basic plan',
    schema: {
      type: 'object',
      properties: {
        plan: { type: 'string', example: 'basic' },
        status: { type: 'string', example: 'active' },
        dailyActionLimit: { type: 'number', example: 2 },
        profileLimit: { type: 'number', example: 2 },
        unlimitedActions: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Successfully downgraded to Basic plan' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Already on Basic plan or no subscription to downgrade' })
  async downgrade(@Request() req) {
    return this.subscriptionsService.downgradeToBasic(req.user.id);
  }
}
