import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeReadingService } from './coffee-reading.service';
import { CoffeeReadingController } from './coffee-reading.controller';
import { CoffeeReading } from '@/entities/coffee-reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoffeeReading])],
  controllers: [CoffeeReadingController],
  providers: [CoffeeReadingService],
})
export class CoffeeReadingModule {}
