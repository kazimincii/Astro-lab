import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TarotReading } from '@/entities/tarot-reading.entity';

@Injectable()
export class TarotService {
  constructor(
    @InjectRepository(TarotReading)
    private tarotRepository: Repository<TarotReading>,
  ) {}

  async createReading(userId: string, question: string, spreadType: string) {
    // TODO: Implement tarot card selection and interpretation
    const reading = this.tarotRepository.create({
      user: { id: userId } as any,
      question,
      spreadType,
      cards: [],
      interpretation: 'Your tarot reading...',
    });

    return this.tarotRepository.save(reading);
  }

  async getReadings(userId: string) {
    return this.tarotRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
