import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodayService } from './today.service';
import { TodayController } from './today.controller';
import { PersonProfile } from '../../entities/person-profile.entity';
import { DailyForecast } from '../../entities/daily-forecast.entity';
import { StarMessage } from '../../entities/star-message.entity';
import { AstroEvent } from '../../entities/astro-event.entity';
import { CalendarEntry } from '../../entities/calendar-entry.entity';
import { ForecastsModule } from '../forecasts/forecasts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonProfile, DailyForecast, StarMessage, AstroEvent, CalendarEntry]),
    ForecastsModule,
  ],
  controllers: [TodayController],
  providers: [TodayService],
  exports: [TodayService],
})
export class TodayModule {}
