import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AstroEventsService } from './astro-events.service';
import { AstroEventsController } from './astro-events.controller';
import { AstroEvent } from '../../entities/astro-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AstroEvent])],
  controllers: [AstroEventsController],
  providers: [AstroEventsService],
  exports: [AstroEventsService],
})
export class AstroEventsModule {}
