import { Controller, Post, Get, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MoodLevel } from '../../entities/journal.entity';

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  async createEntry(
    @Req() req,
    @Body('entryDate') entryDate: string,
    @Body('mood') mood: MoodLevel,
    @Body('content') content: string,
    @Body('tags') tags: string[],
    @Body('personId') personId?: string,
  ) {
    return await this.journalService.createEntry(
      req.user.id,
      new Date(entryDate),
      mood,
      content,
      tags || [],
      personId,
    );
  }

  @Put(':entryId')
  async updateEntry(@Param('entryId') entryId: string, @Body() updates: any) {
    return await this.journalService.updateEntry(entryId, updates);
  }

  @Delete(':entryId')
  async deleteEntry(@Param('entryId') entryId: string) {
    await this.journalService.deleteEntry(entryId);
    return { message: 'Entry deleted successfully' };
  }

  @Get()
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
  async getMoodStats(@Req() req, @Query('days') days?: string) {
    const numDays = days ? parseInt(days) : 30;
    return await this.journalService.getMoodStats(req.user.id, numDays);
  }

  @Get('date/:date')
  async getEntryByDate(@Req() req, @Param('date') date: string) {
    return await this.journalService.getEntryByDate(req.user.id, new Date(date));
  }
}
