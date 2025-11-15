import { Controller, Get, Query } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CalendarCategory } from '../../entities/calendar-entry.entity';

@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Get('range')
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
  async getEntriesByDate(@Query('date') date: string) {
    return await this.calendarsService.getEntriesByDate(new Date(date));
  }

  @Get('monthly')
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
