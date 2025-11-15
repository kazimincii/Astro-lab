import { Controller, Get, Query, Param } from '@nestjs/common';
import { AstroEventsService } from './astro-events.service';
import { AstroEventType } from '../../entities/astro-event.entity';

@Controller('astro-events')
export class AstroEventsController {
  constructor(private readonly eventsService: AstroEventsService) {}

  @Get('upcoming')
  async getUpcomingEvents(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return await this.eventsService.getUpcomingEvents(limitNum);
  }

  @Get('active')
  async getActiveEvents() {
    return await this.eventsService.getActiveEvents();
  }

  @Get('range')
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
  async getRetrogrades() {
    return await this.eventsService.getRetrogrades();
  }

  @Get('eclipses')
  async getEclipses() {
    return await this.eventsService.getEclipses();
  }

  @Get('moon-phases')
  async getMoonPhases() {
    return await this.eventsService.getMoonPhases();
  }

  @Get('type/:type')
  async getEventsByType(@Param('type') type: AstroEventType) {
    return await this.eventsService.getEventsByType(type);
  }
}
