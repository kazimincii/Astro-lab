import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForecastsService } from './forecasts.service';
import { ForecastsController } from './forecasts.controller';
import { DailyForecast } from '@/entities/daily-forecast.entity';
import { PersonProfile } from '@/entities/person-profile.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [TypeOrmModule.forFeature([DailyForecast, PersonProfile]), SubscriptionsModule],
  controllers: [ForecastsController],
  providers: [ForecastsService],
  exports: [ForecastsService],
})
export class ForecastsModule {}
