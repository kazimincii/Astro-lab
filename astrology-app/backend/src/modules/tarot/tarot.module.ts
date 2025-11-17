import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarotService } from './tarot.service';
import { TarotController } from './tarot.controller';
import { TarotReading } from '@/entities/tarot-reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TarotReading])],
  controllers: [TarotController],
  providers: [TarotService],
  exports: [TarotService],
})
export class TarotModule {}
