import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamousPeopleService } from './famous-people.service';
import { FamousPeopleController } from './famous-people.controller';
import { FamousPerson } from '../../entities/famous-person.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FamousPerson, PersonProfile, BirthChart])],
  controllers: [FamousPeopleController],
  providers: [FamousPeopleService],
  exports: [FamousPeopleService],
})
export class FamousPeopleModule {}
