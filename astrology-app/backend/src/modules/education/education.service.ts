import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationContent, ContentCategory, DifficultyLevel } from '../../entities/education-content.entity';

@Injectable()
export class EducationService implements OnModuleInit {
  constructor(
    @InjectRepository(EducationContent)
    private contentRepository: Repository<EducationContent>,
  ) {}

  async onModuleInit() {
    await this.seedContent();
  }

  async seedContent() {
    const sampleContent = [
      {
        title: 'Understanding the 12 Zodiac Signs',
        summary: 'Learn about the fundamental characteristics of each zodiac sign',
        content: 'The zodiac is divided into 12 signs, each representing unique personality traits and tendencies...',
        category: ContentCategory.SIGNS,
        difficulty: DifficultyLevel.BEGINNER,
        tags: ['basics', 'zodiac', 'signs'],
        readingTimeMinutes: 10,
        sortOrder: 1,
      },
      {
        title: 'What Are Planetary Retrogrades?',
        summary: 'Discover the meaning and impact of retrograde planets',
        content: 'When a planet appears to move backward in the sky, we call this retrograde motion...',
        category: ContentCategory.RETROGRADES,
        difficulty: DifficultyLevel.BEGINNER,
        tags: ['retrogrades', 'planets', 'basics'],
        readingTimeMinutes: 8,
        sortOrder: 2,
      },
      {
        title: 'The 12 Houses in Astrology',
        summary: 'Explore the meaning of astrological houses',
        content: 'The birth chart is divided into 12 houses, each governing different life areas...',
        category: ContentCategory.HOUSES,
        difficulty: DifficultyLevel.INTERMEDIATE,
        tags: ['houses', 'birth chart'],
        readingTimeMinutes: 15,
        sortOrder: 3,
      },
    ];

    for (const contentData of sampleContent) {
      const existing = await this.contentRepository.findOne({
        where: { title: contentData.title },
      });

      if (!existing) {
        const content = this.contentRepository.create(contentData);
        await this.contentRepository.save(content);
      }
    }
  }

  async getAllContent(category?: ContentCategory): Promise<EducationContent[]> {
    const query: any = { isPublished: true };

    if (category) {
      query.category = category;
    }

    return await this.contentRepository.find({
      where: query,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async getContentById(id: string): Promise<EducationContent> {
    const content = await this.contentRepository.findOne({ where: { id } });

    if (content) {
      content.viewCount += 1;
      await this.contentRepository.save(content);
    }

    return content;
  }

  async getContentByCategory(category: ContentCategory): Promise<EducationContent[]> {
    return await this.getAllContent(category);
  }
}
