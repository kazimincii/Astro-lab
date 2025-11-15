import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateJournalEntryDto } from './dto/create-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-entry.dto';

@ApiTags('journal')
@ApiBearerAuth('JWT-auth')
@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @ApiOperation({
    summary: 'Create journal entry',
    description:
      'Create a new journal entry with mood tracking, content, and optional tags. Entries can be linked to specific person profiles.',
  })
  @ApiResponse({
    status: 201,
    description: 'Journal entry created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        personId: { type: 'string', nullable: true },
        entryDate: { type: 'string', format: 'date' },
        mood: { type: 'number', example: 4, description: 'Mood level (1-5)' },
        content: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        reflectionPrompt: { type: 'string', nullable: true },
        metadata: {
          type: 'object',
          properties: {
            weatherMood: { type: 'string' },
            majorTransits: { type: 'array', items: { type: 'string' } },
            moonPhase: { type: 'string' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createEntry(@Req() req, @Body() dto: CreateJournalEntryDto) {
    return await this.journalService.createEntry(
      req.user.id,
      new Date(dto.entryDate),
      dto.mood,
      dto.content,
      dto.tags || [],
      dto.personId,
    );
  }

  @Put(':entryId')
  @ApiOperation({
    summary: 'Update journal entry',
    description: 'Update an existing journal entry. All fields are optional.',
  })
  @ApiParam({
    name: 'entryId',
    description: 'Journal entry ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Journal entry updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        entryDate: { type: 'string', format: 'date' },
        mood: { type: 'number' },
        content: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Journal entry not found' })
  async updateEntry(@Param('entryId') entryId: string, @Body() dto: UpdateJournalEntryDto) {
    return await this.journalService.updateEntry(entryId, dto);
  }

  @Delete(':entryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete journal entry',
    description: 'Delete a journal entry permanently.',
  })
  @ApiParam({
    name: 'entryId',
    description: 'Journal entry ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Journal entry deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Journal entry not found' })
  async deleteEntry(@Param('entryId') entryId: string) {
    await this.journalService.deleteEntry(entryId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get user journal entries',
    description:
      'Retrieve all journal entries for the authenticated user, optionally filtered by date range.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering (YYYY-MM-DD)',
    example: '2025-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Journal entries retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          entryDate: { type: 'string', format: 'date' },
          mood: { type: 'number' },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserEntries(
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return await this.journalService.getUserEntries(req.user.id, start, end);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get mood statistics',
    description: 'Get mood statistics and trends over a specified number of days.',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze (default: 30)',
    example: 30,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Mood statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        averageMood: { type: 'number', example: 3.8 },
        moodDistribution: {
          type: 'object',
          properties: {
            '1': { type: 'number', example: 2 },
            '2': { type: 'number', example: 5 },
            '3': { type: 'number', example: 10 },
            '4': { type: 'number', example: 8 },
            '5': { type: 'number', example: 5 },
          },
        },
        trend: { type: 'string', example: 'improving', enum: ['improving', 'declining', 'stable'] },
        totalEntries: { type: 'number', example: 30 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMoodStats(@Req() req, @Query('days') days?: string) {
    const numDays = days ? parseInt(days) : 30;
    return await this.journalService.getMoodStats(req.user.id, numDays);
  }

  @Get('date/:date')
  @ApiOperation({
    summary: 'Get entry by date',
    description: 'Retrieve a journal entry for a specific date.',
  })
  @ApiParam({
    name: 'date',
    description: 'Entry date (YYYY-MM-DD)',
    example: '2025-11-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Journal entry retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        entryDate: { type: 'string', format: 'date' },
        mood: { type: 'number' },
        content: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        metadata: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No entry found for this date' })
  async getEntryByDate(@Req() req, @Param('date') date: string) {
    return await this.journalService.getEntryByDate(req.user.id, new Date(date));
  }
}
