import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ChakrasService } from './chakras.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionsService } from '../actions/actions.service';

@ApiTags('chakras')
@ApiBearerAuth('JWT-auth')
@Controller('chakras')
@UseGuards(JwtAuthGuard)
export class ChakrasController {
  constructor(
    private readonly chakrasService: ChakrasService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post(':personId/generate')
  @ApiOperation({
    summary: 'Generate chakra profile',
    description: 'Generate a detailed chakra energy analysis and balancing recommendations based on astrological chart. This is a premium action that consumes one action credit.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Chakra profile generated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        personId: { type: 'string' },
        chakras: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Root Chakra' },
              energyLevel: { type: 'number', example: 75, description: 'Energy level (0-100)' },
              balance: { type: 'string', enum: ['blocked', 'balanced', 'overactive'], example: 'balanced' },
              description: { type: 'string' },
              affirmations: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        overallBalance: { type: 'number', example: 68.5, description: 'Overall chakra balance (0-100)' },
        recommendations: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient action credits' })
  @ApiResponse({ status: 404, description: 'Person profile not found' })
  async generateChakraProfile(@Req() req, @Param('personId') personId: string) {
    // Check and consume premium action for detailed guidance
    await this.actionsService.checkAndConsumeAction(req.user.id);

    return await this.chakrasService.generateChakraProfile(personId);
  }

  @Get(':personId')
  @ApiOperation({
    summary: 'Get chakra profile',
    description: 'Retrieve the most recent chakra profile analysis for a specific person.',
  })
  @ApiParam({
    name: 'personId',
    description: 'Person profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Chakra profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        personId: { type: 'string' },
        chakras: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              energyLevel: { type: 'number' },
              balance: { type: 'string' },
              description: { type: 'string' },
              affirmations: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        overallBalance: { type: 'number' },
        recommendations: { type: 'array', items: { type: 'string' } },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chakra profile not found' })
  async getChakraProfile(@Param('personId') personId: string) {
    return await this.chakrasService.getChakraProfile(personId);
  }
}
