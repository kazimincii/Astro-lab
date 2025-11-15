import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsService } from './actions.service';
import { ActionLog } from '@/entities/action-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLog])],
  providers: [ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}
