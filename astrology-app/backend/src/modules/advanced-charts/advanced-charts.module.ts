import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvancedChartsService } from './advanced-charts.service';
import { AdvancedChartsController } from './advanced-charts.controller';
import { AdvancedChart } from '../../entities/advanced-chart.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdvancedChart, PersonProfile, BirthChart]), ActionsModule],
  controllers: [AdvancedChartsController],
  providers: [AdvancedChartsService],
  exports: [AdvancedChartsService],
})
export class AdvancedChartsModule {}
