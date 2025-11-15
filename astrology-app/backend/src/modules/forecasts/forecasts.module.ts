import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForecastsService } from './forecasts.service';
import { ForecastsController } from './forecasts.controller';
import { DailyForecast } from '@/entities/daily-forecast.entity';
import { PersonProfile } from '@/entities/person-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyForecast, PersonProfile])],
  controllers: [ForecastsController],
  providers: [ForecastsService],
  exports: [ForecastsService],
})
export class ForecastsModule {}
