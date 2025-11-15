import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AstroMap, AstroMapTheme } from '../../entities/astro-map.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';

@Injectable()
export class AstroMapService {
  constructor(
    @InjectRepository(AstroMap)
    private astroMapRepository: Repository<AstroMap>,
    @InjectRepository(PersonProfile)
    private personRepository: Repository<PersonProfile>,
    @InjectRepository(BirthChart)
    private birthChartRepository: Repository<BirthChart>,
  ) {}

  async generateAstroMap(personId: string): Promise<AstroMap> {
    const person = await this.personRepository.findOne({ where: { id: personId } });
    const birthChart = await this.birthChartRepository.findOne({ where: { personId } });

    if (!person || !birthChart) {
      throw new Error('Person or birth chart not found');
    }

    // Generate planetary lines (simplified for MVP)
    const planetaryLines = this.calculatePlanetaryLines(birthChart);

    const astroMap = this.astroMapRepository.create({
      personId,
      planetaryLines,
      cityAnalyses: [],
    });

    return await this.astroMapRepository.save(astroMap);
  }

  private calculatePlanetaryLines(birthChart: any) {
    // This is a placeholder. In production, this would calculate actual astrocartography lines
    // using the Swiss Ephemeris or similar
    return {
      sun: [],
      moon: [],
      mercury: [],
      venus: [],
      mars: [],
      jupiter: [],
      saturn: [],
      uranus: [],
      neptune: [],
      pluto: [],
    };
  }

  async analyzeCityForPerson(personId: string, city: string, latitude: number, longitude: number): Promise<AstroMap> {
    let astroMap = await this.astroMapRepository.findOne({ where: { personId } });

    if (!astroMap) {
      astroMap = await this.generateAstroMap(personId);
    }

    const analysis = {
      city,
      latitude,
      longitude,
      lifeRating: Math.floor(Math.random() * 5) + 5,
      loveRating: Math.floor(Math.random() * 5) + 5,
      careerRating: Math.floor(Math.random() * 5) + 5,
      summary: this.generateCitySummary(city),
      planetInfluences: this.generatePlanetInfluences(),
    };

    const existingAnalyses = astroMap.cityAnalyses || [];
    const filteredAnalyses = existingAnalyses.filter((a: any) => a.city !== city);
    astroMap.cityAnalyses = [...filteredAnalyses, analysis];

    return await this.astroMapRepository.save(astroMap);
  }

  private generateCitySummary(city: string): string {
    return `${city} offers unique opportunities aligned with your astrological chart. The planetary influences here support various aspects of your life journey.`;
  }

  private generatePlanetInfluences(): string[] {
    const influences = [
      'Sun line brings vitality and recognition',
      'Venus line enhances love and creativity',
      'Jupiter line promotes growth and opportunity',
      'Moon line deepens emotional connections',
    ];

    return influences.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  async getAstroMap(personId: string): Promise<AstroMap | null> {
    return await this.astroMapRepository.findOne({
      where: { personId },
    });
  }

  async updateViewedTheme(personId: string, theme: AstroMapTheme): Promise<AstroMap> {
    const astroMap = await this.getAstroMap(personId);

    if (!astroMap) {
      throw new Error('Astro map not found');
    }

    astroMap.lastViewedTheme = theme;
    return await this.astroMapRepository.save(astroMap);
  }
}
