import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SubscriptionPlansService } from './subscription-plans.service';
import { PlanType } from '../../entities/subscription-plan.entity';

@ApiTags('subscription-plans')
@Controller('subscription-plans')
export class SubscriptionPlansController {
  constructor(private readonly plansService: SubscriptionPlansService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all subscription plans',
    description:
      'Retrieve all available subscription plans with details, features, and pricing information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['basic', 'standard', 'premium'], example: 'standard' },
          name: { type: 'string', example: 'Standard Plan' },
          description: { type: 'string', example: 'Perfect for regular users' },
          monthlyPrice: { type: 'number', example: 9.99 },
          yearlyPrice: { type: 'number', example: 99.99 },
          features: { type: 'array', items: { type: 'string' } },
          dailyActionLimit: { type: 'number', example: 10 },
          profileLimit: { type: 'number', example: 5 },
        },
      },
    },
  })
  async getAllPlans() {
    return await this.plansService.getAllPlans();
  }

  @Get(':planType')
  @ApiOperation({
    summary: 'Get plan by type',
    description: 'Retrieve detailed information about a specific subscription plan.',
  })
  @ApiParam({
    name: 'planType',
    description: 'Plan type',
    enum: ['basic', 'standard', 'premium'],
    example: 'standard',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string', example: 'standard' },
        name: { type: 'string', example: 'Standard Plan' },
        description: { type: 'string' },
        monthlyPrice: { type: 'number', example: 9.99 },
        yearlyPrice: { type: 'number', example: 99.99 },
        features: { type: 'array', items: { type: 'string' } },
        dailyActionLimit: { type: 'number' },
        profileLimit: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async getPlanByType(@Param('planType') planType: PlanType) {
    return await this.plansService.getPlanByType(planType);
  }
}
