import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiorhythmProfile } from '../../entities/biorhythm.entity';
import { PersonProfile } from '../../entities/person-profile.entity';

@Injectable()
export class BiorhythmService {
  constructor(
    @InjectRepository(BiorhythmProfile)
    private biorhythmRepository: Repository<BiorhythmProfile>,
    @InjectRepository(PersonProfile)
    private personRepository: Repository<PersonProfile>,
  ) {}

  async calculateBiorhythm(personId: string, date: Date = new Date()): Promise<BiorhythmProfile> {
    const person = await this.personRepository.findOne({ where: { id: personId } });

    if (!person || !person.birthDate) {
      throw new Error('Person or birth date not found');
    }

    const birthDate = new Date(person.birthDate);
    const daysSinceBirth = Math.floor(
      (date.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Biorhythm cycles
    const physicalCycle = 23;
    const emotionalCycle = 28;
    const intellectualCycle = 33;

    // Calculate values (-1 to 1)
    const physical = Math.sin((2 * Math.PI * daysSinceBirth) / physicalCycle);
    const emotional = Math.sin((2 * Math.PI * daysSinceBirth) / emotionalCycle);
    const intellectual = Math.sin((2 * Math.PI * daysSinceBirth) / intellectualCycle);

    // Find critical days (when crossing zero)
    const criticalDays = this.findCriticalDays(daysSinceBirth, birthDate);

    // Find next peaks
    const nextPeaks = this.findNextPeaks(
      daysSinceBirth,
      birthDate,
      physicalCycle,
      emotionalCycle,
      intellectualCycle,
    );

    const data = {
      physical: Math.round(physical * 100) / 100,
      emotional: Math.round(emotional * 100) / 100,
      intellectual: Math.round(intellectual * 100) / 100,
      criticalDays,
      nextPeaks,
    };

    const commentary = this.generateCommentary(data);

    const biorhythm = this.biorhythmRepository.create({
      personId,
      calculatedDate: date,
      data,
      commentary,
    });

    return await this.biorhythmRepository.save(biorhythm);
  }

  private findCriticalDays(daysSinceBirth: number, birthDate: Date): string[] {
    const criticalDays: string[] = [];
    const cycles = [23, 28, 33];

    for (const cycle of cycles) {
      const remainder = daysSinceBirth % cycle;
      if (remainder < 3 || remainder > cycle - 3) {
        const criticalDate = new Date(birthDate);
        criticalDate.setDate(criticalDate.getDate() + daysSinceBirth);
        criticalDays.push(criticalDate.toISOString().split('T')[0]);
      }
    }

    return criticalDays;
  }

  private findNextPeaks(
    daysSinceBirth: number,
    birthDate: Date,
    physical: number,
    emotional: number,
    intellectual: number,
  ) {
    const findNextPeak = (cycle: number) => {
      const currentPhase = (daysSinceBirth % cycle) / cycle;
      let daysUntilPeak;

      if (currentPhase < 0.25) {
        daysUntilPeak = Math.floor(cycle * 0.25 - currentPhase * cycle);
      } else {
        daysUntilPeak = Math.floor(cycle * (1.25 - currentPhase));
      }

      const peakDate = new Date(birthDate);
      peakDate.setDate(peakDate.getDate() + daysSinceBirth + daysUntilPeak);
      return peakDate.toISOString().split('T')[0];
    };

    return {
      physical: findNextPeak(physical),
      emotional: findNextPeak(emotional),
      intellectual: findNextPeak(intellectual),
    };
  }

  private generateCommentary(data: any): string {
    const avg = (data.physical + data.emotional + data.intellectual) / 3;

    if (avg > 0.5) {
      return 'You are experiencing a high-energy period across all biorhythm cycles. This is an excellent time for important activities and decision-making.';
    } else if (avg > 0) {
      return 'Your biorhythms are generally positive. Moderate energy levels make this a good time for steady progress.';
    } else if (avg > -0.5) {
      return 'Your biorhythms are in a lower phase. Consider taking things easier and focusing on rest and recovery.';
    } else {
      return 'You are in a low-energy period. This is an ideal time for reflection, rest, and recharging your batteries.';
    }
  }

  async getLatestBiorhythm(personId: string): Promise<BiorhythmProfile | null> {
    return await this.biorhythmRepository.findOne({
      where: { personId },
      order: { calculatedDate: 'DESC' },
    });
  }
}
