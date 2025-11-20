import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CoffeeReading } from '@/entities/coffee-reading.entity';

@Injectable()
export class CoffeeReadingService {
  private readonly logger = new Logger(CoffeeReadingService.name);
  private openai: OpenAI | null = null;

  constructor(
    @InjectRepository(CoffeeReading)
    private coffeeReadingRepository: Repository<CoffeeReading>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey.startsWith('sk-')) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  private async analyzeWithVision(imageUrl: string): Promise<{
    symbols: string[];
    patterns: string[];
    interpretation: string;
    pastReading: string;
    presentReading: string;
    futureReading: string;
  }> {
    if (!this.openai) {
      throw new Error('OpenAI API not configured');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert Turkish coffee fortune teller (fal bak) with deep knowledge of traditional coffee cup reading.

When analyzing coffee grounds in a cup, look for:
- Shapes and symbols (animals, objects, letters, numbers)
- Patterns and their positions (top, middle, bottom of cup)
- Dark and light areas
- Lines and their directions

Traditional meanings:
- Top of cup: Present and near future (days/weeks)
- Middle: Medium-term future (weeks/months)
- Bottom: Long-term future (months/years)
- Handle side: Home and family
- Opposite side: Outside world and career

Common symbols:
- Bird: Good news, travel
- Heart: Love, romance
- Ring: Marriage, commitment
- Star: Success, wishes coming true
- Tree: Growth, health
- Mountain: Obstacles, challenges
- Road/Path: Journey, life path
- Eye: Awareness, protection
- Snake: Betrayal, warning
- Flower: Joy, celebration

Format your response as JSON:
{
  "symbols": ["symbol1", "symbol2", "symbol3"],
  "patterns": ["pattern1", "pattern2"],
  "interpretation": "Overall interpretation (2-3 paragraphs)",
  "pastReading": "What the past reveals (1 paragraph)",
  "presentReading": "Current situation (1 paragraph)",
  "futureReading": "Future outlook (1 paragraph)"
}

Be mystical, warm, and hopeful. Focus on guidance and wisdom.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
            {
              type: 'text',
              text: 'Please read this Turkish coffee cup and provide a fortune telling interpretation.',
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      symbols: result.symbols || [],
      patterns: result.patterns || [],
      interpretation: result.interpretation || 'Unable to analyze the coffee cup at this time.',
      pastReading: result.pastReading || '',
      presentReading: result.presentReading || '',
      futureReading: result.futureReading || '',
    };
  }

  private generateFallbackReading(): {
    symbols: string[];
    patterns: string[];
    interpretation: string;
  } {
    const randomSymbols = [
      ['Bird', 'Star', 'Heart'],
      ['Tree', 'Path', 'Ring'],
      ['Mountain', 'Flower', 'Eye'],
      ['Sun', 'Moon', 'River'],
    ];

    const randomInterpretations = [
      'The coffee grounds reveal interesting patterns in your cup. There are signs of positive energy and new beginnings on the horizon. The symbols suggest that you are on the right path, though patience and perseverance will be important.',
      'Your cup shows a beautiful arrangement of symbols. There is a strong indication of growth and transformation in your life. Pay attention to opportunities that come your way, as they may lead to significant positive changes.',
      'The patterns in your cup suggest a time of balance and harmony approaching. Trust your intuition as you navigate current challenges. The symbols point to success through careful planning and steadfast determination.',
    ];

    const symbols = randomSymbols[Math.floor(Math.random() * randomSymbols.length)];
    const interpretation = randomInterpretations[Math.floor(Math.random() * randomInterpretations.length)];

    return {
      symbols,
      patterns: ['Circular patterns', 'Vertical lines'],
      interpretation,
    };
  }

  async createReading(userId: string, imageUrl: string) {
    try {
      let analysisResult;

      if (this.openai) {
        // Use AI vision analysis
        this.logger.log('Analyzing coffee cup with AI vision');
        analysisResult = await this.analyzeWithVision(imageUrl);
      } else {
        // Fallback to random reading
        this.logger.warn('OpenAI not configured, using fallback reading');
        const fallback = this.generateFallbackReading();
        analysisResult = {
          ...fallback,
          pastReading: 'The past shows foundations being laid for your current path.',
          presentReading: 'You are in a period of growth and self-discovery.',
          futureReading: 'The future holds promise and new opportunities.',
        };
      }

      const reading = this.coffeeReadingRepository.create({
        user: { id: userId } as any,
        imageUrl,
        symbols: analysisResult.symbols,
        patterns: analysisResult.patterns,
        interpretation: analysisResult.interpretation,
        pastReading: analysisResult.pastReading,
        presentReading: analysisResult.presentReading,
        futureReading: analysisResult.futureReading,
      });

      return this.coffeeReadingRepository.save(reading);
    } catch (error) {
      this.logger.error('Coffee reading analysis failed', error);

      // Save a fallback reading even if analysis fails
      const fallback = this.generateFallbackReading();
      const reading = this.coffeeReadingRepository.create({
        user: { id: userId } as any,
        imageUrl,
        symbols: fallback.symbols,
        patterns: fallback.patterns,
        interpretation: fallback.interpretation,
        pastReading: 'The past shows foundations being laid for your current path.',
        presentReading: 'You are in a period of growth and self-discovery.',
        futureReading: 'The future holds promise and new opportunities.',
      });

      return this.coffeeReadingRepository.save(reading);
    }
  }

  async getUserReadings(userId: string) {
    return this.coffeeReadingRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async getReading(userId: string, readingId: string) {
    return this.coffeeReadingRepository.findOne({
      where: { id: readingId, user: { id: userId } },
    });
  }
}
