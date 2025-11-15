import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CosmicClimatePost } from '../../entities/cosmic-climate.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CosmicClimateService {
  constructor(
    @InjectRepository(CosmicClimatePost)
    private climateRepository: Repository<CosmicClimatePost>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyPost() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingPost = await this.climateRepository.findOne({
      where: { date: today },
    });

    if (!existingPost) {
      const post = await this.createDailyPost(today);
      await this.climateRepository.save(post);
    }
  }

  async createDailyPost(date: Date): Promise<CosmicClimatePost> {
    const skyHighlights = this.generateSkyHighlights(date);
    const energyTheme = this.generateEnergyTheme(skyHighlights);
    const recommendations = this.generateRecommendations(skyHighlights);

    return this.climateRepository.create({
      date,
      title: `Cosmic Climate for ${date.toDateString()}`,
      content: this.generateContent(skyHighlights, energyTheme),
      skyHighlights,
      energyTheme,
      recommendations,
      isPublished: true,
    });
  }

  private generateSkyHighlights(date: Date) {
    // In production, this would calculate actual astronomical data
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
      majorAspects: [
        {
          aspect: 'Trine',
          planets: ['Venus', 'Jupiter'],
          description: 'Harmonious energy for love and expansion',
        },
      ],
      retrogrades: [],
      voidOfCourseMoon: Math.random() > 0.7,
    };
  }

  private generateEnergyTheme(highlights: any): string {
    return `Today's cosmic energy is influenced by the ${highlights.moonPhase} in ${highlights.moonSign}. This creates a harmonious atmosphere for reflection and growth.`;
  }

  private generateRecommendations(highlights: any): string[] {
    return [
      'Practice gratitude and mindfulness',
      'Connect with loved ones',
      'Take time for self-care',
      'Journal your thoughts and feelings',
      'Engage in creative activities',
    ];
  }

  private generateContent(highlights: any, energyTheme: string): string {
    return `${energyTheme}\n\nThe ${highlights.moonPhase} brings unique opportunities for personal growth. With major planetary aspects creating favorable conditions, this is an excellent time to align with cosmic energies.`;
  }

  async getTodayPost(): Promise<CosmicClimatePost | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.climateRepository.findOne({
      where: { date: today, isPublished: true },
    });
  }

  async getPostsByDateRange(startDate: Date, endDate: Date): Promise<CosmicClimatePost[]> {
    return await this.climateRepository.find({
      where: {
        date: Between(startDate, endDate),
        isPublished: true,
      },
      order: { date: 'DESC' },
    });
  }

  async addReaction(postId: string, emoji: string): Promise<CosmicClimatePost> {
    const post = await this.climateRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new Error('Post not found');
    }

    const reactions = post.reactions || {};
    reactions[emoji] = (reactions[emoji] || 0) + 1;
    post.reactions = reactions;
    post.reactionsCount = Object.values(reactions).reduce((a: number, b: number) => a + b, 0);

    return await this.climateRepository.save(post);
  }
}
