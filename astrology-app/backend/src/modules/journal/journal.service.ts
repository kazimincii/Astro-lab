import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { JournalEntry, MoodLevel } from '../../entities/journal.entity';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalRepository: Repository<JournalEntry>,
  ) {}

  async createEntry(
    userId: string,
    entryDate: Date,
    mood: MoodLevel | null,
    content: string,
    tags: string[],
    personId?: string,
  ): Promise<JournalEntry> {
    // Generate reflection prompt based on current transits (simplified)
    const reflectionPrompt = this.generateReflectionPrompt(entryDate);

    const entry = this.journalRepository.create({
      userId,
      personId,
      entryDate,
      mood,
      content,
      tags,
      reflectionPrompt,
      metadata: {
        weatherMood: 'Calm',
        majorTransits: ['Moon in Pisces'],
        moonPhase: 'Waxing Crescent',
      },
    });

    return await this.journalRepository.save(entry);
  }

  async updateEntry(entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    await this.journalRepository.update(entryId, updates);
    return await this.journalRepository.findOne({ where: { id: entryId } });
  }

  async deleteEntry(entryId: string): Promise<void> {
    await this.journalRepository.delete(entryId);
  }

  async getUserEntries(userId: string, startDate?: Date, endDate?: Date): Promise<JournalEntry[]> {
    const query: any = { userId };

    if (startDate && endDate) {
      query.entryDate = Between(startDate, endDate);
    }

    return await this.journalRepository.find({
      where: query,
      order: { entryDate: 'DESC' },
    });
  }

  async getEntryByDate(userId: string, date: Date): Promise<JournalEntry | null> {
    return await this.journalRepository.findOne({
      where: { userId, entryDate: date },
    });
  }

  private generateReflectionPrompt(date: Date): string {
    const prompts = [
      'What are you grateful for today?',
      'How did you show up for yourself today?',
      'What lesson did the universe offer you today?',
      'What emotion dominated your day and why?',
      'How did you honor your needs today?',
    ];

    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  async getMoodStats(userId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await this.getUserEntries(userId, startDate, new Date());

    const moodCounts = entries.reduce(
      (acc, entry) => {
        if (entry.mood) {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>,
    );

    const avgMood =
      entries.length > 0
        ? entries.reduce((sum, entry) => sum + (entry.mood || 0), 0) / entries.length
        : 0;

    return {
      totalEntries: entries.length,
      moodDistribution: moodCounts,
      averageMood: avgMood,
      period: `${days} days`,
    };
  }
}
