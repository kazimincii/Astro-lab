import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { AstroEvent, AstroEventType } from '../../entities/astro-event.entity';

@Injectable()
export class AstroEventsService {
  constructor(
    @InjectRepository(AstroEvent)
    private eventRepository: Repository<AstroEvent>,
  ) {}

  async createEvent(eventData: Partial<AstroEvent>): Promise<AstroEvent> {
    const event = this.eventRepository.create(eventData);
    return await this.eventRepository.save(event);
  }

  async getUpcomingEvents(limit: number = 10): Promise<AstroEvent[]> {
    const now = new Date();

    return await this.eventRepository.find({
      where: {
        startDate: MoreThan(now),
        isActive: true,
      },
      order: { startDate: 'ASC' },
      take: limit,
    });
  }

  async getActiveEvents(): Promise<AstroEvent[]> {
    const now = new Date();

    return await this.eventRepository.find({
      where: {
        isActive: true,
      },
      order: { startDate: 'ASC' },
    });
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<AstroEvent[]> {
    return await this.eventRepository.find({
      where: {
        startDate: Between(startDate, endDate),
        isActive: true,
      },
      order: { startDate: 'ASC' },
    });
  }

  async getEventsByType(type: AstroEventType): Promise<AstroEvent[]> {
    return await this.eventRepository.find({
      where: { type, isActive: true },
      order: { startDate: 'ASC' },
    });
  }

  async getRetrogrades(): Promise<AstroEvent[]> {
    return await this.getEventsByType(AstroEventType.RETROGRADE);
  }

  async getEclipses(): Promise<AstroEvent[]> {
    return await this.getEventsByType(AstroEventType.ECLIPSE);
  }

  async getMoonPhases(): Promise<AstroEvent[]> {
    const newMoons = await this.getEventsByType(AstroEventType.NEW_MOON);
    const fullMoons = await this.getEventsByType(AstroEventType.FULL_MOON);
    return [...newMoons, ...fullMoons].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );
  }

  async seedEvents() {
    // Seed some sample events
    const sampleEvents = [
      {
        type: AstroEventType.RETROGRADE,
        title: 'Mercury Retrograde',
        description: 'Mercury goes retrograde, a time for reflection and review.',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-25'),
        planet: 'Mercury',
        sign: 'Sagittarius',
        importance: 8,
        globalImpact: 'Communication and technology may face challenges.',
        affectedSigns: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'],
      },
      {
        type: AstroEventType.FULL_MOON,
        title: 'Full Moon in Cancer',
        description: 'A powerful full moon bringing emotional clarity.',
        startDate: new Date('2025-12-15'),
        planet: 'Moon',
        sign: 'Cancer',
        importance: 7,
        globalImpact: 'Emotional sensitivity heightened.',
        affectedSigns: ['Cancer', 'Capricorn'],
      },
    ];

    for (const eventData of sampleEvents) {
      const existing = await this.eventRepository.findOne({
        where: { title: eventData.title, startDate: eventData.startDate },
      });

      if (!existing) {
        await this.createEvent(eventData);
      }
    }
  }
}
