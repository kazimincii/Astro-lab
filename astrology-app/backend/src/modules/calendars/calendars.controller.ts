import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CalendarsService } from './calendars.service';
import { CalendarCategory } from '../../entities/calendar-entry.entity';

@ApiTags('calendars')
@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Get('range')
  @ApiOperation({
    summary: 'Get calendar entries by date range',
    description:
      'Retrieve astrological calendar entries (beauty, health, activity, spiritual guidance) for a specific date range, optionally filtered by category.',
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
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
    enum: ['beauty', 'health', 'activity', 'spiritual', 'transit', 'moon'],
    example: 'beauty',
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar entries retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          date: { type: 'string', format: 'date' },
          category: {
            type: 'string',
            enum: ['beauty', 'health', 'activity', 'spiritual', 'transit', 'moon'],
          },
          rating: { type: 'number', example: 8, description: 'Rating (1-10)' },
          tip: { type: 'string', example: 'Great day for haircuts and beauty treatments' },
          details: {
            type: 'object',
            properties: {
              moonPhase: { type: 'string' },
              moonSign: { type: 'string' },
              voidOfCourse: { type: 'boolean' },
              planetaryHour: { type: 'string' },
              favorableActivities: { type: 'array', items: { type: 'string' } },
              unfavorableActivities: { type: 'array', items: { type: 'string' } },
            },
          },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  })
  async getEntriesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('category') category?: CalendarCategory,
  ) {
    return await this.calendarsService.getEntriesByDateRange(
      new Date(startDate),
      new Date(endDate),
      category,
    );
  }

  @Get('date')
  @ApiOperation({
    summary: 'Get calendar entries by date',
    description:
      'Retrieve all astrological calendar entries for a specific date across all categories.',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Date to query (YYYY-MM-DD)',
    example: '2025-11-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar entries retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          date: { type: 'string', format: 'date' },
          category: { type: 'string' },
          rating: { type: 'number' },
          tip: { type: 'string' },
          details: { type: 'object' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  })
  async getEntriesByDate(@Query('date') date: string) {
    return await this.calendarsService.getEntriesByDate(new Date(date));
  }

  @Get('monthly')
  @ApiOperation({
    summary: 'Get monthly calendar',
    description:
      'Retrieve astrological calendar for an entire month, optionally filtered by category.',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Year',
    example: 2025,
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    required: true,
    description: 'Month (1-12)',
    example: 11,
    type: Number,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
    enum: ['beauty', 'health', 'activity', 'spiritual', 'transit', 'moon'],
    example: 'health',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly calendar retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        year: { type: 'number', example: 2025 },
        month: { type: 'number', example: 11 },
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', format: 'date' },
              category: { type: 'string' },
              rating: { type: 'number' },
              tip: { type: 'string' },
              details: { type: 'object' },
            },
          },
        },
      },
    },
  })
  async getMonthlyCalendar(
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('category') category?: CalendarCategory,
  ) {
    return await this.calendarsService.getMonthlyCalendar(
      parseInt(year),
      parseInt(month),
      category,
    );
  }
}
