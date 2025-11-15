import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { TodayService } from './today.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('today')
@UseGuards(JwtAuthGuard)
export class TodayController {
  constructor(private readonly todayService: TodayService) {}

  @Get()
  async getTodaySummary(@Req() req, @Query('profileId') profileId?: string) {
    return await this.todayService.getTodaySummary(req.user.id, profileId);
  }
}
