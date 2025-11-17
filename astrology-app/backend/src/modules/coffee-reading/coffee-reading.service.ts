import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoffeeReading } from '@/entities/coffee-reading.entity';

@Injectable()
export class CoffeeReadingService {
  constructor(
    @InjectRepository(CoffeeReading)
    private coffeeReadingRepository: Repository<CoffeeReading>,
  ) {}

  async createReading(userId: string, imageUrl: string) {
    // TODO: Implement AI vision analysis
    const reading = this.coffeeReadingRepository.create({
      user: { id: userId } as any,
      imageUrl,
      interpretation: 'Coffee cup reading...',
    });

    return this.coffeeReadingRepository.save(reading);
  }
}
