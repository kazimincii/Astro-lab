import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChakraProfile, ChakraStatus } from '../../entities/chakra.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';

@Injectable()
export class ChakrasService {
  constructor(
    @InjectRepository(ChakraProfile)
    private chakraRepository: Repository<ChakraProfile>,
    @InjectRepository(PersonProfile)
    private personRepository: Repository<PersonProfile>,
    @InjectRepository(BirthChart)
    private birthChartRepository: Repository<BirthChart>,
  ) {}

  async generateChakraProfile(personId: string): Promise<ChakraProfile> {
    const person = await this.personRepository.findOne({ where: { id: personId } });
    const birthChart = await this.birthChartRepository.findOne({ where: { personId } });

    if (!person) {
      throw new Error('Person not found');
    }

    // Generate chakra states based on birth chart if available
    const chakraStates = this.calculateChakraStates(birthChart);
    const overallGuidance = this.generateOverallGuidance(chakraStates);
    const meditation = this.generateMeditation(chakraStates);

    const chakraProfile = this.chakraRepository.create({
      personId,
      chakraStates,
      overallGuidance,
      meditation,
    });

    return await this.chakraRepository.save(chakraProfile);
  }

  private calculateChakraStates(birthChart: any) {
    // This is a simplified version. In production, this would use actual astrological calculations
    const generateChakraState = (name: string, baseScore: number) => ({
      name,
      status: baseScore > 60 ? ChakraStatus.OVERACTIVE :
              baseScore < 40 ? ChakraStatus.UNDERACTIVE :
              ChakraStatus.BALANCED,
      score: baseScore,
      tips: this.getChakraTips(name),
    });

    return {
      root: generateChakraState('Root (Muladhara)', 50 + Math.random() * 30),
      sacral: generateChakraState('Sacral (Svadhisthana)', 50 + Math.random() * 30),
      solarPlexus: generateChakraState('Solar Plexus (Manipura)', 50 + Math.random() * 30),
      heart: generateChakraState('Heart (Anahata)', 50 + Math.random() * 30),
      throat: generateChakraState('Throat (Vishuddha)', 50 + Math.random() * 30),
      thirdEye: generateChakraState('Third Eye (Ajna)', 50 + Math.random() * 30),
      crown: generateChakraState('Crown (Sahasrara)', 50 + Math.random() * 30),
    };
  }

  private getChakraTips(chakraName: string): string[] {
    const tips: Record<string, string[]> = {
      'Root (Muladhara)': [
        'Practice grounding exercises like walking barefoot',
        'Eat root vegetables',
        'Use red color therapy',
        'Practice yoga poses like Mountain Pose',
        'Connect with nature',
      ],
      'Sacral (Svadhisthana)': [
        'Engage in creative activities',
        'Practice hip-opening yoga poses',
        'Drink plenty of water',
        'Wear orange colors',
        'Practice emotional expression',
      ],
      'Solar Plexus (Manipura)': [
        'Practice core-strengthening exercises',
        'Set healthy boundaries',
        'Use yellow color therapy',
        'Practice confidence-building affirmations',
        'Engage in activities that boost self-esteem',
      ],
      'Heart (Anahata)': [
        'Practice loving-kindness meditation',
        'Do heart-opening yoga poses',
        'Spend time with loved ones',
        'Use green or pink color therapy',
        'Practice forgiveness exercises',
      ],
      'Throat (Vishuddha)': [
        'Practice speaking your truth',
        'Try singing or chanting',
        'Wear blue colors',
        'Keep a journal',
        'Practice neck stretches',
      ],
      'Third Eye (Ajna)': [
        'Practice meditation and visualization',
        'Keep a dream journal',
        'Limit screen time before bed',
        'Use indigo color therapy',
        'Practice intuition-building exercises',
      ],
      'Crown (Sahasrara)': [
        'Practice meditation daily',
        'Spend time in silence',
        'Connect with spirituality',
        'Use violet or white color therapy',
        'Practice mindfulness',
      ],
    };

    return tips[chakraName] || [];
  }

  private generateOverallGuidance(chakraStates: any): string {
    const balancedCount = Object.values(chakraStates).filter(
      (chakra: any) => chakra.status === ChakraStatus.BALANCED
    ).length;

    if (balancedCount >= 5) {
      return 'Your energy centers are generally well-balanced. Continue your current practices to maintain this harmony.';
    } else if (balancedCount >= 3) {
      return 'Several of your chakras need attention. Focus on the underactive or overactive ones to improve overall balance.';
    } else {
      return 'Your energy system needs significant rebalancing. Consider working with a holistic practitioner for personalized guidance.';
    }
  }

  private generateMeditation(chakraStates: any) {
    return {
      recommended: [
        'Full body chakra meditation',
        'Color breathing meditation',
        'Sound healing with chakra frequencies',
      ],
      breathwork: [
        'Alternate nostril breathing',
        'Deep belly breathing',
        'Box breathing (4-4-4-4)',
      ],
    };
  }

  async getChakraProfile(personId: string): Promise<ChakraProfile | null> {
    return await this.chakraRepository.findOne({
      where: { personId },
      order: { createdAt: 'DESC' },
    });
  }
}
