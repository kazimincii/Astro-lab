import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NumerologyReport } from '@/entities/numerology-report.entity';

@Injectable()
export class NumerologyService {
  private readonly letterValues: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
  };

  private readonly vowels = new Set(['A', 'E', 'I', 'O', 'U']);

  private readonly interpretations = {
    lifePath: {
      1: 'The Leader - Independent, ambitious, and pioneering. You are a natural leader with strong willpower and determination.',
      2: 'The Peacemaker - Cooperative, diplomatic, and sensitive. You excel at creating harmony and building partnerships.',
      3: 'The Creative - Expressive, optimistic, and social. You have a natural gift for communication and artistic expression.',
      4: 'The Builder - Practical, organized, and hardworking. You create stable foundations and value order and discipline.',
      5: 'The Freedom Seeker - Adventurous, versatile, and dynamic. You thrive on change, travel, and new experiences.',
      6: 'The Nurturer - Responsible, caring, and protective. You are devoted to family and creating harmonious environments.',
      7: 'The Seeker - Analytical, introspective, and spiritual. You seek truth, wisdom, and deeper understanding.',
      8: 'The Powerhouse - Ambitious, authoritative, and material-focused. You have natural business acumen and leadership skills.',
      9: 'The Humanitarian - Compassionate, idealistic, and selfless. You are driven to make the world a better place.',
      11: 'The Intuitive - Highly intuitive, spiritual, and inspirational. You are a visionary with deep spiritual insights.',
      22: 'The Master Builder - Practical visionary who can turn dreams into reality. You have the power to achieve great things.',
      33: 'The Master Teacher - Compassionate leader focused on uplifting humanity. You embody unconditional love and guidance.',
    },
    destiny: {
      1: 'Your destiny is to lead and innovate. You are meant to pioneer new paths and inspire others through your independence.',
      2: 'Your destiny is to bring people together. You are meant to create harmony and balance in relationships.',
      3: 'Your destiny is to express creativity. You are meant to inspire and uplift others through art and communication.',
      4: 'Your destiny is to build lasting structures. You are meant to create stability and order in the world.',
      5: 'Your destiny is to experience freedom. You are meant to explore, adapt, and help others embrace change.',
      6: 'Your destiny is to nurture and heal. You are meant to create loving environments and care for others.',
      7: 'Your destiny is to seek wisdom. You are meant to uncover truth and share deep spiritual insights.',
      8: 'Your destiny is to master the material world. You are meant to achieve success and empower others.',
      9: 'Your destiny is to serve humanity. You are meant to inspire compassion and global consciousness.',
      11: 'Your destiny is to illuminate. You are meant to be a spiritual beacon and inspire others to higher consciousness.',
      22: 'Your destiny is to manifest visions. You are meant to create large-scale positive change in the world.',
      33: 'Your destiny is to teach unconditional love. You are meant to heal and uplift humanity through compassion.',
    },
  };

  constructor(
    @InjectRepository(NumerologyReport)
    private numerologyRepository: Repository<NumerologyReport>,
  ) {}

  private reduceToSingleDigit(sum: number, allowMaster: boolean = true): number {
    while (sum > 9) {
      // Check for master numbers
      if (allowMaster && (sum === 11 || sum === 22 || sum === 33)) {
        return sum;
      }
      // Reduce: sum digits
      const digits = sum.toString().split('').map(Number);
      sum = digits.reduce((acc, digit) => acc + digit, 0);
    }
    return sum;
  }

  private calculateLifePath(birthDate: Date): number {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1; // 0-indexed
    const day = birthDate.getDate();

    // Reduce each component separately
    const reducedDay = this.reduceToSingleDigit(day);
    const reducedMonth = this.reduceToSingleDigit(month);
    const reducedYear = this.reduceToSingleDigit(year);

    // Sum and reduce again
    const sum = reducedDay + reducedMonth + reducedYear;
    return this.reduceToSingleDigit(sum);
  }

  private calculateDestinyNumber(fullName: string): number {
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    let sum = 0;

    for (const char of cleanName) {
      sum += this.letterValues[char] || 0;
    }

    return this.reduceToSingleDigit(sum);
  }

  private calculateSoulUrge(fullName: string): number {
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    let sum = 0;

    for (const char of cleanName) {
      if (this.vowels.has(char)) {
        sum += this.letterValues[char] || 0;
      }
    }

    return this.reduceToSingleDigit(sum);
  }

  private calculatePersonality(fullName: string): number {
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    let sum = 0;

    for (const char of cleanName) {
      if (!this.vowels.has(char)) {
        sum += this.letterValues[char] || 0;
      }
    }

    return this.reduceToSingleDigit(sum);
  }

  private calculateBirthdayNumber(birthDate: Date): number {
    const day = birthDate.getDate();
    return this.reduceToSingleDigit(day);
  }

  private calculateMaturityNumber(lifePath: number, destiny: number): number {
    return this.reduceToSingleDigit(lifePath + destiny);
  }

  private getStrengths(lifePath: number): string[] {
    const strengthsMap: { [key: number]: string[] } = {
      1: ['Leadership', 'Independence', 'Innovation', 'Courage', 'Determination'],
      2: ['Diplomacy', 'Cooperation', 'Patience', 'Intuition', 'Empathy'],
      3: ['Creativity', 'Communication', 'Optimism', 'Self-expression', 'Social skills'],
      4: ['Organization', 'Practicality', 'Reliability', 'Hard work', 'Discipline'],
      5: ['Adaptability', 'Freedom', 'Versatility', 'Adventure', 'Progressive thinking'],
      6: ['Responsibility', 'Nurturing', 'Harmony', 'Compassion', 'Service'],
      7: ['Analysis', 'Wisdom', 'Spirituality', 'Introspection', 'Research'],
      8: ['Ambition', 'Authority', 'Business acumen', 'Material success', 'Executive ability'],
      9: ['Humanitarianism', 'Compassion', 'Idealism', 'Artistic talent', 'Global awareness'],
      11: ['Intuition', 'Inspiration', 'Spiritual insight', 'Visionary', 'Idealistic'],
      22: ['Master builder', 'Practical visionary', 'Large-scale impact', 'Leadership', 'Manifestation'],
      33: ['Master teacher', 'Healing', 'Selfless service', 'Unconditional love', 'Spiritual guidance'],
    };
    return strengthsMap[lifePath] || strengthsMap[1];
  }

  private getChallenges(lifePath: number): string[] {
    const challengesMap: { [key: number]: string[] } = {
      1: ['Ego', 'Stubbornness', 'Impatience', 'Domineering', 'Self-centeredness'],
      2: ['Over-sensitivity', 'Indecision', 'Codependency', 'Timidity', 'Avoiding conflict'],
      3: ['Scattered energy', 'Superficiality', 'Exaggeration', 'Gossip', 'Lack of focus'],
      4: ['Rigidity', 'Resistance to change', 'Workaholism', 'Narrow-mindedness', 'Stubbornness'],
      5: ['Restlessness', 'Irresponsibility', 'Excess', 'Lack of commitment', 'Impulsiveness'],
      6: ['Worry', 'Perfectionism', 'Self-righteousness', 'Meddling', 'Martyrdom'],
      7: ['Isolation', 'Skepticism', 'Coldness', 'Evasiveness', 'Hidden motives'],
      8: ['Materialism', 'Workaholism', 'Power struggles', 'Status obsession', 'Impatience'],
      9: ['Martyrdom', 'Impracticality', 'Self-neglect', 'Scattered focus', 'Emotional distance'],
      11: ['Anxiety', 'Nervousness', 'Impracticality', 'Oversensitivity', 'Self-doubt'],
      22: ['Overwhelm', 'Self-doubt', 'Nervous tension', 'Unrealistic expectations', 'Pressure'],
      33: ['Burnout', 'Over-responsibility', 'Emotional overwhelm', 'Difficulty saying no', 'Self-sacrifice'],
    };
    return challengesMap[lifePath] || challengesMap[1];
  }

  private getCareerPaths(lifePath: number): string[] {
    const careerMap: { [key: number]: string[] } = {
      1: ['Entrepreneur', 'Executive', 'Leader', 'Inventor', 'Pioneer'],
      2: ['Counselor', 'Diplomat', 'Mediator', 'Therapist', 'Team player'],
      3: ['Artist', 'Writer', 'Entertainer', 'Designer', 'Public speaker'],
      4: ['Accountant', 'Engineer', 'Architect', 'Manager', 'Craftsperson'],
      5: ['Travel agent', 'Sales', 'Journalist', 'Photographer', 'Entrepreneur'],
      6: ['Teacher', 'Nurse', 'Counselor', 'Interior designer', 'Social worker'],
      7: ['Researcher', 'Analyst', 'Scientist', 'Philosopher', 'Spiritual teacher'],
      8: ['Business owner', 'Financial advisor', 'Real estate', 'CEO', 'Banker'],
      9: ['Humanitarian worker', 'Artist', 'Healer', 'Philanthropist', 'Global activist'],
      11: ['Spiritual teacher', 'Psychic', 'Counselor', 'Inventor', 'Inspirational speaker'],
      22: ['Master builder', 'International diplomat', 'Visionary leader', 'Architect', 'Large-scale entrepreneur'],
      33: ['Master teacher', 'Healer', 'Spiritual guide', 'Humanitarian leader', 'Counselor'],
    };
    return careerMap[lifePath] || careerMap[1];
  }

  private getCompatibleNumbers(lifePath: number): number[] {
    const compatibilityMap: { [key: number]: number[] } = {
      1: [1, 3, 5, 9],
      2: [2, 4, 6, 8],
      3: [1, 3, 5, 9],
      4: [2, 4, 6, 8],
      5: [1, 3, 5, 7, 9],
      6: [2, 3, 6, 9],
      7: [4, 5, 7],
      8: [2, 4, 6, 8],
      9: [1, 3, 6, 9],
      11: [2, 11, 22],
      22: [4, 11, 22],
      33: [6, 9, 11, 22, 33],
    };
    return compatibilityMap[lifePath] || [1, 2, 3];
  }

  async generateReport(userId: string, fullName: string, birthDate: Date) {
    // Calculate all core numbers
    const lifePathNumber = this.calculateLifePath(birthDate);
    const destinyNumber = this.calculateDestinyNumber(fullName);
    const soulUrgeNumber = this.calculateSoulUrge(fullName);
    const personalityNumber = this.calculatePersonality(fullName);
    const birthdayNumber = this.calculateBirthdayNumber(birthDate);
    const maturityNumber = this.calculateMaturityNumber(lifePathNumber, destinyNumber);

    // Get interpretations
    const lifePathInterpretation = this.interpretations.lifePath[lifePathNumber] || 'No interpretation available';
    const destinyInterpretation = this.interpretations.destiny[destinyNumber] || 'No interpretation available';

    const report = this.numerologyRepository.create({
      user: { id: userId } as any,
      fullName,
      birthDate,
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber,
      birthdayNumber,
      maturityNumber,
      lifePathInterpretation,
      destinyInterpretation,
      strengths: this.getStrengths(lifePathNumber),
      challenges: this.getChallenges(lifePathNumber),
      careerPaths: this.getCareerPaths(lifePathNumber),
      compatibleNumbers: this.getCompatibleNumbers(lifePathNumber),
    });

    return this.numerologyRepository.save(report);
  }

  async getUserReport(userId: string) {
    return this.numerologyRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
