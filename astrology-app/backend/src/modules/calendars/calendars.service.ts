import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CalendarEntry, CalendarCategory } from '../../entities/calendar-entry.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(CalendarEntry)
    private calendarRepository: Repository<CalendarEntry>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyCalendarEntries() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categories = Object.values(CalendarCategory);

    for (const category of categories) {
      const existingEntry = await this.calendarRepository.findOne({
        where: { date: today, category },
      });

      if (!existingEntry) {
        const entry = this.generateEntryForCategory(today, category);
        await this.calendarRepository.save(entry);
      }
    }
  }

  private generateEntryForCategory(date: Date, category: CalendarCategory): CalendarEntry {
    const rating = Math.floor(Math.random() * 10) + 1;
    const tip = this.generateTip(category, rating);
    const details = this.generateDetails(category, date);
    const tags = this.generateTags(category);

    return this.calendarRepository.create({
      date,
      category,
      rating,
      tip,
      details,
      tags,
    });
  }

  private generateTip(category: CalendarCategory, rating: number): string {
    const tips = {
      [CalendarCategory.BEAUTY]:
        rating > 7
          ? 'Excellent day for beauty treatments and self-care.'
          : 'Focus on natural beauty and gentle routines.',
      [CalendarCategory.HEALTH]:
        rating > 7
          ? 'Great energy for physical activity and health goals.'
          : 'Take it easy and focus on rest and recovery.',
      [CalendarCategory.ACTIVITY]:
        rating > 7
          ? 'Perfect day for important activities and new beginnings.'
          : 'Better to postpone major activities if possible.',
      [CalendarCategory.SPIRITUAL]:
        rating > 7
          ? 'Heightened spiritual awareness and intuition.'
          : 'Good time for grounding and centering practices.',
      [CalendarCategory.TRANSIT]:
        rating > 7
          ? 'Favorable planetary alignments support your goals.'
          : 'Navigate challenges with patience and awareness.',
      [CalendarCategory.MOON]:
        rating > 7
          ? 'Moon energy supports manifestation and growth.'
          : 'Time for release and letting go.',
    };

    return tips[category] || 'A day of balance and moderation.';
  }

  private generateDetails(category: CalendarCategory, date: Date) {
    const moonPhases = [
      'New Moon',
      'Waxing Crescent',
      'First Quarter',
      'Waxing Gibbous',
      'Full Moon',
      'Waning Gibbous',
      'Last Quarter',
      'Waning Crescent',
    ];
    const signs = [
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ];

    return {
      moonPhase: moonPhases[Math.floor(Math.random() * moonPhases.length)],
      moonSign: signs[Math.floor(Math.random() * signs.length)],
      voidOfCourse: Math.random() > 0.8,
      favorableActivities: this.getFavorableActivities(category),
      unfavorableActivities: this.getUnfavorableActivities(category),
    };
  }

  private getFavorableActivities(category: CalendarCategory): string[] {
    const activities = {
      [CalendarCategory.BEAUTY]: ['Haircuts', 'Skincare', 'Massage', 'Spa treatments'],
      [CalendarCategory.HEALTH]: ['Exercise', 'Medical checkups', 'Healthy meal prep'],
      [CalendarCategory.ACTIVITY]: ['New projects', 'Important meetings', 'Signing contracts'],
      [CalendarCategory.SPIRITUAL]: ['Meditation', 'Prayer', 'Energy work', 'Ritual'],
      [CalendarCategory.TRANSIT]: ['All activities aligned with current transits'],
      [CalendarCategory.MOON]: ['Activities aligned with moon phase'],
    };

    return activities[category] || [];
  }

  private getUnfavorableActivities(category: CalendarCategory): string[] {
    return ['Major decisions during void moon', 'Rushing important matters'];
  }

  private generateTags(category: CalendarCategory): string[] {
    const tags = {
      [CalendarCategory.BEAUTY]: ['beauty', 'self-care'],
      [CalendarCategory.HEALTH]: ['health', 'wellness'],
      [CalendarCategory.ACTIVITY]: ['productivity', 'action'],
      [CalendarCategory.SPIRITUAL]: ['spiritual', 'meditation'],
      [CalendarCategory.TRANSIT]: ['planetary', 'astrology'],
      [CalendarCategory.MOON]: ['lunar', 'moon'],
    };

    return tags[category] || [];
  }

  async getEntriesByDateRange(
    startDate: Date,
    endDate: Date,
    category?: CalendarCategory,
  ): Promise<CalendarEntry[]> {
    const query: any = {
      date: Between(startDate, endDate),
    };

    if (category) {
      query.category = category;
    }

    return await this.calendarRepository.find({
      where: query,
      order: { date: 'ASC', category: 'ASC' },
    });
  }

  async getEntriesByDate(date: Date): Promise<CalendarEntry[]> {
    return await this.calendarRepository.find({
      where: { date },
      order: { category: 'ASC' },
    });
  }

  async getMonthlyCalendar(
    year: number,
    month: number,
    category?: CalendarCategory,
  ): Promise<CalendarEntry[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await this.getEntriesByDateRange(startDate, endDate, category);
  }
}
