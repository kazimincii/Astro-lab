import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuraScanService } from './aura-scan.service';
import { AuraScanController } from './aura-scan.controller';
import { FaceReading } from '../../entities/face-reading.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [TypeOrmModule.forFeature([FaceReading, PersonProfile]), ConfigModule, ActionsModule],
  controllers: [AuraScanController],
  providers: [AuraScanService],
  exports: [AuraScanService],
})
export class AuraScanModule {}
