import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';
import { RelationshipProfile } from '../../entities/relationship.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RelationshipProfile, PersonProfile, BirthChart]),
    ActionsModule,
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService],
  exports: [RelationshipService],
})
export class RelationshipModule {}
