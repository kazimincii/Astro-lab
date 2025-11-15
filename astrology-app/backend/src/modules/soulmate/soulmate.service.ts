import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoulmateProfile } from '../../entities/soulmate.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';
import {
  UserConnection,
  ConnectionType,
  ConnectionStatus,
} from '../../entities/user-connection.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class SoulmateService {
  constructor(
    @InjectRepository(SoulmateProfile)
    private soulmateRepository: Repository<SoulmateProfile>,
    @InjectRepository(PersonProfile)
    private personRepository: Repository<PersonProfile>,
    @InjectRepository(BirthChart)
    private birthChartRepository: Repository<BirthChart>,
    @InjectRepository(UserConnection)
    private connectionRepository: Repository<UserConnection>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateSoulmateProfile(personId: string): Promise<SoulmateProfile> {
    const person = await this.personRepository.findOne({ where: { id: personId } });
    const birthChart = await this.birthChartRepository.findOne({ where: { personId } });

    if (!person) {
      throw new Error('Person not found');
    }

    const archetype = this.determineArchetype(birthChart);
    const description = this.generateDescription(archetype);
    const meetingScenarios = this.generateMeetingScenarios(archetype);
    const partnerPreferences = this.calculatePartnerPreferences(birthChart);
    const idealPartnerQualities = this.generateIdealQualities(archetype);
    const relationshipGuidance = this.generateGuidance(archetype);

    const soulmateProfile = this.soulmateRepository.create({
      personId,
      archetype,
      description,
      meetingScenarios,
      partnerPreferences,
      idealPartnerQualities,
      relationshipGuidance,
    });

    return await this.soulmateRepository.save(soulmateProfile);
  }

  private determineArchetype(birthChart: any): string {
    const archetypes = [
      'The Romantic Dreamer',
      'The Loyal Companion',
      'The Passionate Adventurer',
      'The Wise Protector',
      'The Creative Muse',
      'The Spiritual Partner',
    ];
    return archetypes[Math.floor(Math.random() * archetypes.length)];
  }

  private generateDescription(archetype: string): string {
    const descriptions = {
      'The Romantic Dreamer':
        'Your soulmate is someone who shares your vision of love as a transformative force...',
      'The Loyal Companion':
        'Your ideal partner values loyalty, stability, and building a strong foundation together...',
      'The Passionate Adventurer':
        'Your soulmate brings excitement and spontaneity into your life...',
      'The Wise Protector': 'Your ideal partner provides wisdom, security, and emotional depth...',
      'The Creative Muse':
        'Your soulmate inspires your creativity and shares your artistic vision...',
      'The Spiritual Partner': 'Your ideal partner walks a spiritual path alongside you...',
    };
    return descriptions[archetype] || 'Your soulmate complements your unique essence...';
  }

  private generateMeetingScenarios(archetype: string) {
    return [
      {
        context: 'work',
        description: 'Professional environment where skills align',
        probability: 30,
      },
      {
        context: 'online',
        description: 'Digital connection through shared interests',
        probability: 25,
      },
      { context: 'travel', description: 'Adventure or journey to new places', probability: 20 },
      {
        context: 'spiritual',
        description: 'Spiritual gathering or transformative event',
        probability: 15,
      },
      { context: 'social', description: 'Through friends or social activities', probability: 10 },
    ];
  }

  private calculatePartnerPreferences(birthChart: any) {
    return {
      sunSigns: ['Aries', 'Leo', 'Sagittarius'],
      moonSigns: ['Cancer', 'Scorpio', 'Pisces'],
      risingSigns: ['Gemini', 'Libra', 'Aquarius'],
      venusSign: 'Taurus',
      marsSign: 'Scorpio',
      traits: ['Creative', 'Loyal', 'Adventurous', 'Empathetic'],
    };
  }

  private generateIdealQualities(archetype: string): string[] {
    return [
      'Emotional intelligence and empathy',
      'Shared values and life goals',
      'Mutual respect and support',
      'Healthy communication skills',
      'Sense of humor and playfulness',
      'Personal growth mindset',
    ];
  }

  private generateGuidance(archetype: string): string {
    return 'Focus on being your authentic self. Your soulmate will appreciate the real you. Be open to connections in unexpected places.';
  }

  async getSoulmateProfile(personId: string): Promise<SoulmateProfile | null> {
    return await this.soulmateRepository.findOne({
      where: { personId },
      order: { createdAt: 'DESC' },
    });
  }

  async findMatches(userId: string): Promise<any[]> {
    // This would implement actual matching logic based on birth charts
    // For MVP, returning placeholder data
    return [];
  }

  async createConnection(
    user1Id: string,
    user2Id: string,
    type: ConnectionType,
  ): Promise<UserConnection> {
    const connection = this.connectionRepository.create({
      user1Id,
      user2Id,
      type,
      status: ConnectionStatus.PENDING,
    });

    return await this.connectionRepository.save(connection);
  }

  async acceptConnection(connectionId: string): Promise<UserConnection> {
    const connection = await this.connectionRepository.findOne({ where: { id: connectionId } });

    if (!connection) {
      throw new Error('Connection not found');
    }

    connection.status = ConnectionStatus.ACCEPTED;
    connection.acceptedAt = new Date();
    connection.isMutual = true;

    return await this.connectionRepository.save(connection);
  }
}
