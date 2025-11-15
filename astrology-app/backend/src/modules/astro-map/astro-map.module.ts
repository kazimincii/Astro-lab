import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AstroMapService } from './astro-map.service';
import { AstroMapController } from './astro-map.controller';
import { AstroMap } from '../../entities/astro-map.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [TypeOrmModule.forFeature([AstroMap, PersonProfile, BirthChart]), ActionsModule],
  controllers: [AstroMapController],
  providers: [AstroMapService],
  exports: [AstroMapService],
})
export class AstroMapModule {}
