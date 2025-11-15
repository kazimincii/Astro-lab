import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoulmateService } from './soulmate.service';
import { SoulmateController } from './soulmate.controller';
import { SoulmateProfile } from '../../entities/soulmate.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';
import { UserConnection } from '../../entities/user-connection.entity';
import { User } from '../../entities/user.entity';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SoulmateProfile, PersonProfile, BirthChart, UserConnection, User]),
    ActionsModule,
  ],
  controllers: [SoulmateController],
  providers: [SoulmateService],
  exports: [SoulmateService],
})
export class SoulmateModule {}
