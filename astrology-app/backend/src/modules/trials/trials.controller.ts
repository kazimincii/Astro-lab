import { Controller, Post, Get, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TrialsService } from './trials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StartTrialDto } from './dto/start-trial.dto';

@ApiTags('trials')
@ApiBearerAuth('JWT-auth')
@Controller('trials')
@UseGuards(JwtAuthGuard)
export class TrialsController {
  constructor(private readonly trialsService: TrialsService) {}

  @Post('start')
  @ApiOperation({
    summary: 'Start trial period',
    description:
      'Start a free trial period for Standard or Premium plan. Users get access to premium features for 7 days.',
  })
  @ApiResponse({
    status: 201,
    description: 'Trial started successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        planType: { type: 'string', example: 'standard' },
        status: { type: 'string', example: 'active' },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        premiumActionsTotal: { type: 'number', example: 10 },
        premiumActionsRemaining: { type: 'number', example: 10 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid plan type or trial not eligible' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User already has active trial or subscription' })
  async startTrial(@Req() req, @Body() body: StartTrialDto) {
    return await this.trialsService.startTrial(req.user.id, body.planType);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active trial',
    description: 'Retrieve the current active trial for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active trial retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        planType: { type: 'string', example: 'standard' },
        status: { type: 'string', example: 'active' },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        premiumActionsRemaining: { type: 'number', example: 7 },
        daysRemaining: { type: 'number', example: 5 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active trial found' })
  async getActiveTrial(@Req() req) {
    return await this.trialsService.getUserActiveTrial(req.user.id);
  }

  @Delete('cancel')
  @ApiOperation({
    summary: 'Cancel active trial',
    description:
      'Cancel the current active trial period. User will lose access to premium features immediately.',
  })
  @ApiResponse({
    status: 200,
    description: 'Trial cancelled successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Trial cancelled successfully' },
        cancelledAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active trial found' })
  async cancelTrial(@Req() req) {
    return await this.trialsService.cancelTrial(req.user.id);
  }
}
