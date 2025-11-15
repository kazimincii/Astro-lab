import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TodayService } from './today.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('today')
@ApiBearerAuth('JWT-auth')
@Controller('today')
@UseGuards(JwtAuthGuard)
export class TodayController {
  constructor(private readonly todayService: TodayService) {}

  @Get()
  @ApiOperation({
    summary: 'Get today\'s summary',
    description: 'Retrieve comprehensive daily astrological summary including horoscope, transits, moon phase, and personalized insights.',
  })
  @ApiQuery({
    name: 'profileId',
    required: false,
    description: 'Optional profile ID. If not provided, uses user\'s main profile.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Today\'s summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        date: { type: 'string', format: 'date', example: '2025-11-15' },
        dayOfWeek: { type: 'string', example: 'Friday' },
        zodiacSign: { type: 'string', example: 'Scorpio' },
        horoscope: { type: 'string', example: 'Today brings opportunities for deep transformation...' },
        moonPhase: { type: 'string', example: 'Waxing Gibbous' },
        moonSign: { type: 'string', example: 'Pisces' },
        luckyNumber: { type: 'number', example: 7 },
        luckyColor: { type: 'string', example: 'Purple' },
        luckyTime: { type: 'string', example: '14:00-16:00' },
        energyLevel: { type: 'number', example: 80, description: 'Energy level 0-100' },
        mood: { type: 'string', example: 'Reflective' },
        focus: { type: 'string', example: 'Career and personal growth' },
        advice: { type: 'string', example: 'Trust your intuition when making important decisions' },
        transits: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              planet: { type: 'string', example: 'Venus' },
              aspect: { type: 'string', example: 'Trine' },
              interpretation: { type: 'string', example: 'Harmonious relationships and creativity' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Action limit reached or premium feature' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getTodaySummary(@Req() req, @Query('profileId') profileId?: string) {
    return await this.todayService.getTodaySummary(req.user.id, profileId);
  }
}
