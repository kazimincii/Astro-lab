import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('actions')
@ApiBearerAuth('JWT-auth')
@Controller('actions')
@UseGuards(JwtAuthGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('remaining')
  @ApiOperation({
    summary: 'Get remaining actions',
    description: 'Retrieve information about remaining premium actions for the current user based on their subscription plan.',
  })
  @ApiResponse({
    status: 200,
    description: 'Remaining actions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        plan: {
          type: 'string',
          enum: ['basic', 'standard', 'premium'],
          example: 'standard',
        },
        limit: { type: 'number', example: 4, description: 'Daily action limit for this plan' },
        used: { type: 'number', example: 2, description: 'Actions used today' },
        remaining: { type: 'number', example: 2, description: 'Actions remaining today' },
        isTrial: { type: 'boolean', example: false, description: 'Whether user is on trial' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRemainingActions(@Req() req) {
    return await this.actionsService.getRemainingActions(req.user.id);
  }

  @Get('plan')
  @ApiOperation({
    summary: 'Get user plan type',
    description: 'Retrieve the current subscription plan type for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User plan retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        planType: {
          type: 'string',
          enum: ['basic', 'standard', 'premium'],
          example: 'standard',
          description: 'Current active plan type',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserPlan(@Req() req) {
    const planType = await this.actionsService.getUserPlan(req.user.id);
    return { planType };
  }
}
