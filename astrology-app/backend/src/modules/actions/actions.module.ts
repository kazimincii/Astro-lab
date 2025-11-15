import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { ActionLog } from '@/entities/action-log.entity';
import { Subscription } from '@/entities/subscription.entity';
import { Trial } from '@/entities/trial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLog, Subscription, Trial])],
  controllers: [ActionsController],
  providers: [ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}
