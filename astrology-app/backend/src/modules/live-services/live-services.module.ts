import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveServicesService } from './live-services.service';
import { LiveServicesController } from './live-services.controller';
import { LiveSession } from '../../entities/live-session.entity';
import { User } from '../../entities/user.entity';
import { Expert } from '../../entities/expert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LiveSession, User, Expert])],
  controllers: [LiveServicesController],
  providers: [LiveServicesService],
  exports: [LiveServicesService],
})
export class LiveServicesModule {}
