import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelationshipProfile } from '../../entities/relationship.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(RelationshipProfile)
    private relationshipRepository: Repository<RelationshipProfile>,
    @InjectRepository(PersonProfile)
    private personRepository: Repository<PersonProfile>,
    @InjectRepository(BirthChart)
    private birthChartRepository: Repository<BirthChart>,
  ) {}

  async analyzeCompatibility(userId: string, person1Id: string, person2Id: string): Promise<RelationshipProfile> {
    const person1 = await this.personRepository.findOne({ where: { id: person1Id } });
    const person2 = await this.personRepository.findOne({ where: { id: person2Id } });

    if (!person1 || !person2) {
      throw new Error('One or both persons not found');
    }

    const chart1 = await this.birthChartRepository.findOne({ where: { personId: person1Id } });
    const chart2 = await this.birthChartRepository.findOne({ where: { personId: person2Id } });

    // Calculate compatibility scores
    const compatibilityScores = this.calculateCompatibilityScores(chart1, chart2);
    const summary = this.generateSummary(person1, person2, compatibilityScores);
    const timeline = this.generateTimeline();
    const strengths = this.generateStrengths(compatibilityScores);
    const challenges = this.generateChallenges(compatibilityScores);
    const advice = this.generateAdvice(compatibilityScores);

    const relationship = this.relationshipRepository.create({
      userId,
      person1Id,
      person2Id,
      compatibilityScores,
      summary,
      timeline,
      strengths,
      challenges,
      advice,
    });

    return await this.relationshipRepository.save(relationship);
  }

  private calculateCompatibilityScores(chart1: any, chart2: any) {
    // Simplified compatibility calculation
    // In production, this would use actual synastry techniques
    return {
      overall: Math.floor(Math.random() * 40) + 60,
      emotional: Math.floor(Math.random() * 40) + 60,
      communication: Math.floor(Math.random() * 40) + 60,
      values: Math.floor(Math.random() * 40) + 60,
      physical: Math.floor(Math.random() * 40) + 60,
    };
  }

  private generateSummary(person1: PersonProfile, person2: PersonProfile, scores: any): string {
    const avgScore = Object.values(scores).reduce((a: number, b: number) => a + b, 0) / Object.keys(scores).length;

    if (avgScore >= 80) {
      return `${person1.name} and ${person2.name} share an excellent connection with strong potential for a harmonious relationship.`;
    } else if (avgScore >= 60) {
      return `${person1.name} and ${person2.name} have good compatibility with some areas that may need attention and understanding.`;
    } else {
      return `${person1.name} and ${person2.name} may face challenges but can build a relationship through effort and communication.`;
    }
  }

  private generateTimeline() {
    const now = new Date();
    const past6Months = [];
    const next6Months = [];

    for (let i = 6; i >= 1; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      past6Months.push({
        date: date.toISOString().split('T')[0],
        theme: this.getRandomTheme(),
        description: 'Period of growth and understanding in the relationship.',
      });
    }

    for (let i = 1; i <= 6; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() + i);
      next6Months.push({
        date: date.toISOString().split('T')[0],
        theme: this.getRandomTheme(),
        description: 'Opportunities for deeper connection and shared experiences.',
      });
    }

    return { past6Months, next6Months };
  }

  private getRandomTheme(): string {
    const themes = ['Growth', 'Communication', 'Passion', 'Stability', 'Adventure', 'Harmony'];
    return themes[Math.floor(Math.random() * themes.length)];
  }

  private generateStrengths(scores: any): string {
    return 'Strong emotional connection, good communication, shared values, and mutual respect.';
  }

  private generateChallenges(scores: any): string {
    return 'May need to work on finding balance between independence and togetherness.';
  }

  private generateAdvice(scores: any): string {
    return 'Focus on open communication, spend quality time together, and appreciate each other\'s differences.';
  }

  async getRelationship(userId: string, person1Id: string, person2Id: string): Promise<RelationshipProfile | null> {
    return await this.relationshipRepository.findOne({
      where: [
        { userId, person1Id, person2Id },
        { userId, person1Id: person2Id, person2Id: person1Id },
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
