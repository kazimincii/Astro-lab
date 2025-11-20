import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoulmateProfile } from '../../entities/soulmate.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';
import { UserConnection, ConnectionType, ConnectionStatus } from '../../entities/user-connection.entity';
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
      'The Romantic Dreamer': 'Your soulmate is someone who shares your vision of love as a transformative force...',
      'The Loyal Companion': 'Your ideal partner values loyalty, stability, and building a strong foundation together...',
      'The Passionate Adventurer': 'Your soulmate brings excitement and spontaneity into your life...',
      'The Wise Protector': 'Your ideal partner provides wisdom, security, and emotional depth...',
      'The Creative Muse': 'Your soulmate inspires your creativity and shares your artistic vision...',
      'The Spiritual Partner': 'Your ideal partner walks a spiritual path alongside you...',
    };
    return descriptions[archetype] || 'Your soulmate complements your unique essence...';
  }

  private generateMeetingScenarios(archetype: string) {
    return [
      { context: 'work', description: 'Professional environment where skills align', probability: 30 },
      { context: 'online', description: 'Digital connection through shared interests', probability: 25 },
      { context: 'travel', description: 'Adventure or journey to new places', probability: 20 },
      { context: 'spiritual', description: 'Spiritual gathering or transformative event', probability: 15 },
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

  private calculateCompatibility(profile1: PersonProfile, profile2: PersonProfile): number {
    let score = 0;

    // Element compatibility
    const elementCompatibility = {
      fire: ['fire', 'air'],  // Aries, Leo, Sagittarius
      earth: ['earth', 'water'], // Taurus, Virgo, Capricorn
      air: ['air', 'fire'],   // Gemini, Libra, Aquarius
      water: ['water', 'earth'], // Cancer, Scorpio, Pisces
    };

    const signElements = {
      Aries: 'fire', Taurus: 'earth', Gemini: 'air', Cancer: 'water',
      Leo: 'fire', Virgo: 'earth', Libra: 'air', Scorpio: 'water',
      Sagittarius: 'fire', Capricorn: 'earth', Aquarius: 'air', Pisces: 'water',
    };

    // Sun sign compatibility (40% weight)
    if (profile1.sunSign && profile2.sunSign) {
      const element1 = signElements[profile1.sunSign];
      const element2 = signElements[profile2.sunSign];

      if (element1 && element2 && elementCompatibility[element1]?.includes(element2)) {
        score += 40;
      } else if (profile1.sunSign === profile2.sunSign) {
        score += 30; // Same sign - strong understanding
      } else {
        score += 10; // Different but learning opportunity
      }
    }

    // Moon sign compatibility (30% weight) - emotional compatibility
    if (profile1.moonSign && profile2.moonSign) {
      const element1 = signElements[profile1.moonSign];
      const element2 = signElements[profile2.moonSign];

      if (element1 && element2 && elementCompatibility[element1]?.includes(element2)) {
        score += 30;
      } else if (profile1.moonSign === profile2.moonSign) {
        score += 25;
      } else {
        score += 5;
      }
    }

    // Rising sign compatibility (30% weight) - first impressions
    if (profile1.risingSign && profile2.risingSign) {
      const element1 = signElements[profile1.risingSign];
      const element2 = signElements[profile2.risingSign];

      if (element1 && element2 && elementCompatibility[element1]?.includes(element2)) {
        score += 30;
      } else if (profile1.risingSign === profile2.risingSign) {
        score += 25;
      } else {
        score += 5;
      }
    }

    // Bonus: Venus/Mars synastry (classic attraction indicators)
    // If both have complementary fire/air or earth/water combinations
    const hasCompatibleElements =
      (profile1.sunSign && profile2.moonSign &&
       elementCompatibility[signElements[profile1.sunSign]]?.includes(signElements[profile2.moonSign])) ||
      (profile1.moonSign && profile2.sunSign &&
       elementCompatibility[signElements[profile1.moonSign]]?.includes(signElements[profile2.sunSign]));

    if (hasCompatibleElements) {
      score += 10; // Bonus for Sun-Moon synastry
    }

    return Math.min(score, 100); // Cap at 100
  }

  async findMatches(userId: string): Promise<Array<{
    user: User;
    profile: PersonProfile;
    compatibilityScore: number;
    reasons: string[];
  }>> {
    // Get current user's main profile
    const userProfile = await this.personRepository.findOne({
      where: { owner: { id: userId }, isMainProfile: true },
      relations: ['owner'],
    });

    if (!userProfile || !userProfile.sunSign) {
      return [];
    }

    // Find all other users with profiles (excluding current user)
    const otherProfiles = await this.personRepository.find({
      where: { isMainProfile: true },
      relations: ['owner'],
      take: 100, // Limit for performance
    });

    // Calculate compatibility scores
    const matches = otherProfiles
      .filter(profile => profile.owner.id !== userId)
      .map(profile => {
        const score = this.calculateCompatibility(userProfile, profile);
        const reasons = this.generateCompatibilityReasons(userProfile, profile, score);

        return {
          user: profile.owner,
          profile,
          compatibilityScore: score,
          reasons,
        };
      })
      .filter(match => match.compatibilityScore >= 50) // Only show matches above 50%
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 20); // Return top 20 matches

    return matches;
  }

  private generateCompatibilityReasons(profile1: PersonProfile, profile2: PersonProfile, score: number): string[] {
    const reasons: string[] = [];

    const signElements = {
      Aries: 'fire', Taurus: 'earth', Gemini: 'air', Cancer: 'water',
      Leo: 'fire', Virgo: 'earth', Libra: 'air', Scorpio: 'water',
      Sagittarius: 'fire', Capricorn: 'earth', Aquarius: 'air', Pisces: 'water',
    };

    // Sun sign compatibility
    if (profile1.sunSign && profile2.sunSign) {
      if (profile1.sunSign === profile2.sunSign) {
        reasons.push(`Both ${profile1.sunSign} - deep mutual understanding`);
      } else {
        const element1 = signElements[profile1.sunSign];
        const element2 = signElements[profile2.sunSign];
        reasons.push(`${profile1.sunSign}-${profile2.sunSign}: ${element1} and ${element2} energy blend well`);
      }
    }

    // Moon sign compatibility
    if (profile1.moonSign && profile2.moonSign) {
      if (profile1.moonSign === profile2.moonSign) {
        reasons.push(`Moon in ${profile1.moonSign} - emotional harmony`);
      } else {
        reasons.push(`Moon signs create emotional balance`);
      }
    }

    // Rising sign compatibility
    if (profile1.risingSign && profile2.risingSign) {
      if (profile1.risingSign === profile2.risingSign) {
        reasons.push(`Same Rising sign - similar life approach`);
      } else {
        reasons.push(`Complementary Rising signs enhance connection`);
      }
    }

    // Overall compatibility message
    if (score >= 80) {
      reasons.push('Exceptional astrological synastry - rare connection');
    } else if (score >= 70) {
      reasons.push('Strong natural compatibility');
    } else if (score >= 60) {
      reasons.push('Good foundation for lasting connection');
    } else if (score >= 50) {
      reasons.push('Promising compatibility with growth potential');
    }

    return reasons;
  }

  async createConnection(user1Id: string, user2Id: string, type: ConnectionType): Promise<UserConnection> {
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
