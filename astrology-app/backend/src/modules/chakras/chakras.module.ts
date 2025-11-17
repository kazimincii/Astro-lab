import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChakrasService } from './chakras.service';
import { ChakrasController } from './chakras.controller';
import { ChakraProfile } from '../../entities/chakra.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChakraProfile, PersonProfile, BirthChart]), ActionsModule],
  controllers: [ChakrasController],
  providers: [ChakrasService],
  exports: [ChakrasService],
})
export class ChakrasModule {}
