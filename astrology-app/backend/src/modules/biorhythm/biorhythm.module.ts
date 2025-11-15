import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiorhythmService } from './biorhythm.service';
import { BiorhythmController } from './biorhythm.controller';
import { BiorhythmProfile } from '../../entities/biorhythm.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [TypeOrmModule.forFeature([BiorhythmProfile, PersonProfile]), ActionsModule],
  controllers: [BiorhythmController],
  providers: [BiorhythmService],
  exports: [BiorhythmService],
})
export class BiorhythmModule {}
