import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';
import { BirthChart } from '@/entities/birth-chart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BirthChart])],
  controllers: [ChartsController],
  providers: [ChartsService],
  exports: [ChartsService],
})
export class ChartsModule {}
