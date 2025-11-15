import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { FaceReading } from '../../entities/face-reading.entity';
import OpenAI from 'openai';

@Injectable()
export class AuraScanService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(FaceReading)
    private faceReadingRepository: Repository<FaceReading>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('ai.openaiApiKey'),
    });
  }

  async performAuraScan(userId: string, imageUrl: string, personId?: string): Promise<FaceReading> {
    const startTime = Date.now();

    try {
      // Call OpenAI Vision API for aura scan
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert in reading people's aura and energy from their photos.
            Provide a thoughtful, positive, and respectful personality reading based on visual cues.
            Focus on:
            - General vibe and presence
            - Communication style
            - Relationship tendencies
            - Strengths
            - Gentle watch-outs

            IMPORTANT: Do NOT infer or mention:
            - Health or mental health
            - Politics or religion
            - Race, ethnicity, or demographics
            - Crime or sexual matters

            Keep the reading entertainment-focused, uplifting, and non-clinical.
            Format your response as JSON with these keys:
            {
              "archetype": "single word archetype like Dreamer, Strategist, Protector, etc.",
              "summary": "2-3 sentence overview",
              "vibeAndPresence": "paragraph about their energy",
              "communicationStyle": "paragraph about how they communicate",
              "relationshipStyle": "paragraph about their approach to relationships",
              "strengths": ["strength1", "strength2", "strength3"],
              "watchOuts": ["gentle watchout1", "gentle watchout2"]
            }`,
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
                text: 'Please analyze this person\'s aura and provide a personality reading.',
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const processingTime = Date.now() - startTime;

      const sections = {
        vibeAndPresence: result.vibeAndPresence || '',
        communicationStyle: result.communicationStyle || '',
        relationshipStyle: result.relationshipStyle || '',
        strengths: result.strengths || [],
        watchOuts: result.watchOuts || [],
      };

      const faceReading = this.faceReadingRepository.create({
        userId,
        personId,
        imageUrl,
        archetype: result.archetype || 'The Observer',
        summary: result.summary || '',
        sections,
        metadata: {
          modelUsed: 'gpt-4-vision-preview',
          confidence: 0.85,
          processingTime,
        },
      });

      return await this.faceReadingRepository.save(faceReading);
    } catch (error) {
      console.error('Aura scan error:', error);
      throw new Error('Failed to perform aura scan');
    }
  }

  async getUserAuraScans(userId: string): Promise<FaceReading[]> {
    return await this.faceReadingRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAuraScan(id: string): Promise<FaceReading | null> {
    return await this.faceReadingRepository.findOne({ where: { id } });
  }
}
