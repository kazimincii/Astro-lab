import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveServicesService } from './live-services.service';
import { LiveServicesController } from './live-services.controller';
import { LiveSession } from '../../entities/live-session.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LiveSession, User])],
  controllers: [LiveServicesController],
  providers: [LiveServicesService],
  exports: [LiveServicesService],
})
export class LiveServicesModule {}
