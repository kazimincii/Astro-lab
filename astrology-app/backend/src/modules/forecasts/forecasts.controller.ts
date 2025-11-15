import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ForecastsService } from './forecasts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('forecasts')
@ApiBearerAuth('JWT-auth')
@Controller('forecasts')
@UseGuards(JwtAuthGuard)
export class ForecastsController {
  constructor(private forecastsService: ForecastsService) {}

  @Get('today/:profileId')
  @ApiOperation({
    summary: 'Get daily forecast',
    description:
      "Retrieve today's astrological forecast for a profile including planetary transits, daily themes, and personalized guidance.",
  })
  @ApiParam({
    name: 'profileId',
    description: 'Profile ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily forecast retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        profileId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        date: { type: 'string', format: 'date', example: '2025-11-15' },
        sunTransit: {
          type: 'object',
          properties: {
            sign: { type: 'string', example: 'Scorpio' },
            degree: { type: 'number', example: 23.5 },
            interpretation: { type: 'string', example: 'Deep introspection and transformation...' },
          },
        },
        moonTransit: {
          type: 'object',
          properties: {
            sign: { type: 'string', example: 'Pisces' },
            phase: { type: 'string', example: 'Waxing Gibbous' },
            interpretation: {
              type: 'string',
              example: 'Heightened intuition and emotional awareness...',
            },
          },
        },
        dailyTheme: { type: 'string', example: 'Focus on inner growth and emotional healing' },
        luckyColors: { type: 'array', items: { type: 'string' }, example: ['Purple', 'Silver'] },
        luckyNumbers: { type: 'array', items: { type: 'number' }, example: [3, 7, 12] },
        advice: {
          type: 'string',
          example: 'Trust your intuition today. Take time for self-reflection.',
        },
        energy: { type: 'number', example: 75, description: 'Energy level 0-100' },
        mood: { type: 'string', example: 'Contemplative' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Action limit reached or premium feature' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getTodayForecast(@Param('profileId') profileId: string, @Request() req) {
    return this.forecastsService.getTodayForecast(profileId, req.user.id);
  }
}
