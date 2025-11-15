import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CosmicClimateService } from './cosmic-climate.service';
import { AddReactionDto } from './dto/add-reaction.dto';

@ApiTags('cosmic-climate')
@Controller('cosmic-climate')
export class CosmicClimateController {
  constructor(private readonly climateService: CosmicClimateService) {}

  @Get('today')
  @ApiOperation({
    summary: "Get today's cosmic climate",
    description:
      'Retrieve the daily cosmic climate post with astrological insights, planetary influences, and guidance for the day.',
  })
  @ApiResponse({
    status: 200,
    description: "Today's cosmic climate retrieved successfully",
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        date: { type: 'string', format: 'date' },
        title: { type: 'string', example: 'Mercury Retrograde Continues' },
        content: { type: 'string', example: 'Today the cosmic energy is focused on...' },
        mainInfluences: {
          type: 'array',
          items: { type: 'string' },
          example: ['Mercury Retrograde', 'Venus in Taurus'],
        },
        mood: { type: 'string', example: 'Reflective and introspective' },
        recommendations: { type: 'array', items: { type: 'string' } },
        warnings: { type: 'array', items: { type: 'string' } },
        reactions: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 42 },
            breakdown: { type: 'object', example: { '👍': 20, '❤️': 15, '🌟': 7 } },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  async getTodayPost() {
    return await this.climateService.getTodayPost();
  }

  @Get('range')
  @ApiOperation({
    summary: 'Get cosmic climate by date range',
    description: 'Retrieve cosmic climate posts for a specific date range.',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (YYYY-MM-DD)',
    example: '2025-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Cosmic climate posts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          date: { type: 'string', format: 'date' },
          title: { type: 'string' },
          content: { type: 'string' },
          mainInfluences: { type: 'array', items: { type: 'string' } },
          mood: { type: 'string' },
          reactions: { type: 'object' },
        },
      },
    },
  })
  async getPostsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.climateService.getPostsByDateRange(new Date(startDate), new Date(endDate));
  }

  @Post(':postId/react')
  @ApiOperation({
    summary: 'Add reaction to cosmic climate post',
    description: 'Add an emoji reaction to a cosmic climate post.',
  })
  @ApiParam({
    name: 'postId',
    description: 'Cosmic climate post ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Reaction added successfully',
    schema: {
      type: 'object',
      properties: {
        postId: { type: 'string' },
        emoji: { type: 'string' },
        totalReactions: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async addReaction(@Param('postId') postId: string, @Body() dto: AddReactionDto) {
    return await this.climateService.addReaction(postId, dto.emoji);
  }
}
