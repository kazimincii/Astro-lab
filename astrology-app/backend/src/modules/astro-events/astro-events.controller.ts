import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AstroEventsService } from './astro-events.service';
import { AstroEventType } from '../../entities/astro-event.entity';

@ApiTags('astro-events')
@Controller('astro-events')
export class AstroEventsController {
  constructor(private readonly eventsService: AstroEventsService) {}

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get upcoming astrological events',
    description: 'Retrieve upcoming astrological events like retrogrades, eclipses, major transits, and moon phases.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of events to return (default: 10)',
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['retrograde', 'eclipse', 'major_transit', 'new_moon', 'full_moon', 'ingress', 'station'] },
          title: { type: 'string', example: 'Mercury Retrograde in Gemini' },
          description: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time', nullable: true },
          planet: { type: 'string', example: 'Mercury' },
          sign: { type: 'string', example: 'Gemini' },
          importance: { type: 'number', example: 8, description: 'Importance scale (1-10)' },
          globalImpact: { type: 'string' },
          affectedSigns: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  })
  async getUpcomingEvents(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return await this.eventsService.getUpcomingEvents(limitNum);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get currently active events',
    description: 'Retrieve astrological events that are currently happening (e.g., active retrogrades).',
  })
  @ApiResponse({
    status: 200,
    description: 'Active events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          planet: { type: 'string' },
          sign: { type: 'string' },
          importance: { type: 'number' },
        },
      },
    },
  })
  async getActiveEvents() {
    return await this.eventsService.getActiveEvents();
  }

  @Get('range')
  @ApiOperation({
    summary: 'Get events by date range',
    description: 'Retrieve astrological events within a specific date range.',
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
    example: '2025-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          planet: { type: 'string' },
          sign: { type: 'string' },
        },
      },
    },
  })
  async getEventsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.eventsService.getEventsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('retrogrades')
  @ApiOperation({
    summary: 'Get planetary retrogrades',
    description: 'Retrieve all current and upcoming planetary retrograde periods.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrogrades retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string', example: 'Mercury Retrograde' },
          planet: { type: 'string', example: 'Mercury' },
          sign: { type: 'string', example: 'Gemini' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          description: { type: 'string' },
          globalImpact: { type: 'string' },
        },
      },
    },
  })
  async getRetrogrades() {
    return await this.eventsService.getRetrogrades();
  }

  @Get('eclipses')
  @ApiOperation({
    summary: 'Get eclipses',
    description: 'Retrieve all current and upcoming solar and lunar eclipses.',
  })
  @ApiResponse({
    status: 200,
    description: 'Eclipses retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string', example: 'Total Solar Eclipse in Aries' },
          type: { type: 'string', example: 'eclipse' },
          startDate: { type: 'string', format: 'date-time' },
          description: { type: 'string' },
          sign: { type: 'string' },
          importance: { type: 'number' },
          affectedSigns: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  })
  async getEclipses() {
    return await this.eventsService.getEclipses();
  }

  @Get('moon-phases')
  @ApiOperation({
    summary: 'Get moon phases',
    description: 'Retrieve upcoming new moons and full moons.',
  })
  @ApiResponse({
    status: 200,
    description: 'Moon phases retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string', example: 'Full Moon in Scorpio' },
          type: { type: 'string', enum: ['new_moon', 'full_moon'] },
          startDate: { type: 'string', format: 'date-time' },
          sign: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  })
  async getMoonPhases() {
    return await this.eventsService.getMoonPhases();
  }

  @Get('type/:type')
  @ApiOperation({
    summary: 'Get events by type',
    description: 'Retrieve astrological events filtered by specific type.',
  })
  @ApiParam({
    name: 'type',
    description: 'Event type',
    enum: ['retrograde', 'eclipse', 'major_transit', 'new_moon', 'full_moon', 'ingress', 'station'],
    example: 'retrograde',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          planet: { type: 'string' },
          sign: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  })
  async getEventsByType(@Param('type') type: AstroEventType) {
    return await this.eventsService.getEventsByType(type);
  }
}
