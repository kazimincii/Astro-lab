import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { WidgetConfig } from '../../entities/widget-config.entity';
import { PersonProfile } from '../../entities/person-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WidgetConfig, PersonProfile])],
  controllers: [WidgetsController],
  providers: [WidgetsService],
  exports: [WidgetsService],
})
export class WidgetsModule {}
