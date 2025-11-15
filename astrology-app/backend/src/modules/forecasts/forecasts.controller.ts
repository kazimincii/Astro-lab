import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ForecastsService } from './forecasts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('forecasts')
@UseGuards(JwtAuthGuard)
export class ForecastsController {
  constructor(private forecastsService: ForecastsService) {}

  @Get('today/:profileId')
  async getTodayForecast(@Param('profileId') profileId: string) {
    return this.forecastsService.getTodayForecast(profileId);
  }
}
