import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { CalendarEntry } from '../../entities/calendar-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntry])],
  controllers: [CalendarsController],
  providers: [CalendarsService],
  exports: [CalendarsService],
})
export class CalendarsModule {}
