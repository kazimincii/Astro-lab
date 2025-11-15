import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NumerologyService } from './numerology.service';
import { NumerologyController } from './numerology.controller';
import { NumerologyReport } from '@/entities/numerology-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NumerologyReport])],
  controllers: [NumerologyController],
  providers: [NumerologyService],
})
export class NumerologyModule {}
