import { Module } from '@nestjs/common';
import { EphemerisService } from './ephemeris.service';

@Module({
  providers: [EphemerisService],
  exports: [EphemerisService],
})
export class ServicesModule {}
