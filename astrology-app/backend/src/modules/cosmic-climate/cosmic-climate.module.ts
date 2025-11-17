import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CosmicClimateService } from './cosmic-climate.service';
import { CosmicClimateController } from './cosmic-climate.controller';
import { CosmicClimatePost } from '../../entities/cosmic-climate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CosmicClimatePost])],
  controllers: [CosmicClimateController],
  providers: [CosmicClimateService],
  exports: [CosmicClimateService],
})
export class CosmicClimateModule {}
