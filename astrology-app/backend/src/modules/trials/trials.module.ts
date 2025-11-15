import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrialsService } from './trials.service';
import { TrialsController } from './trials.controller';
import { Trial } from '../../entities/trial.entity';
import { User } from '../../entities/user.entity';
import { Subscription } from '../../entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trial, User, Subscription])],
  controllers: [TrialsController],
  providers: [TrialsService],
  exports: [TrialsService],
})
export class TrialsModule {}
