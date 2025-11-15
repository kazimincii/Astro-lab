import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FamousPerson } from '../../entities/famous-person.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';

@Injectable()
export class FamousPeopleService {
  constructor(
    @InjectRepository(FamousPerson)
    private famousRepository: Repository<FamousPerson>,
    @InjectRepository(PersonProfile)
    private personRepository: Repository<PersonProfile>,
    @InjectRepository(BirthChart)
    private chartRepository: Repository<BirthChart>,
  ) {}

  async findMatches(personId: string, limit: number = 10): Promise<FamousPerson[]> {
    const person = await this.personRepository.findOne({ where: { id: personId } });
    const birthChart = await this.chartRepository.findOne({ where: { personId } });

    if (!person || !birthChart) {
      throw new Error('Person or birth chart not found');
    }

    // In a real implementation, this would match based on actual astrological similarities
    // For MVP, we'll return a random selection
    return await this.famousRepository.find({
      where: { isActive: true },
      order: { popularity: 'DESC' },
      take: limit,
    });
  }

  async searchByCategory(category: string, limit: number = 20): Promise<FamousPerson[]> {
    return await this.famousRepository
      .createQueryBuilder('person')
      .where(':category = ANY(person.categories)', { category })
      .andWhere('person.isActive = :isActive', { isActive: true })
      .orderBy('person.popularity', 'DESC')
      .limit(limit)
      .getMany();
  }

  async searchBySign(sign: string, limit: number = 20): Promise<FamousPerson[]> {
    return await this.famousRepository.find({
      where: [
        { sunSign: sign, isActive: true },
        { moonSign: sign, isActive: true },
        { risingSign: sign, isActive: true },
      ],
      order: { popularity: 'DESC' },
      take: limit,
    });
  }

  async getFamousPerson(id: string): Promise<FamousPerson | null> {
    return await this.famousRepository.findOne({ where: { id } });
  }

  async getAllFamousPeople(skip: number = 0, take: number = 50): Promise<FamousPerson[]> {
    return await this.famousRepository.find({
      where: { isActive: true },
      order: { popularity: 'DESC' },
      skip,
      take,
    });
  }

  async seedFamousPeople() {
    const samplePeople = [
      {
        name: 'Albert Einstein',
        profession: 'Physicist',
        categories: ['scientist', 'thinker'],
        birthDate: new Date('1879-03-14'),
        birthTime: '11:30',
        birthPlace: 'Ulm, Germany',
        sunSign: 'Pisces',
        moonSign: 'Sagittarius',
        risingSign: 'Cancer',
        popularity: 100,
      },
      {
        name: 'Marie Curie',
        profession: 'Physicist & Chemist',
        categories: ['scientist'],
        birthDate: new Date('1867-11-07'),
        sunSign: 'Scorpio',
        popularity: 95,
      },
      {
        name: 'Leonardo da Vinci',
        profession: 'Artist & Inventor',
        categories: ['artist', 'inventor'],
        birthDate: new Date('1452-04-15'),
        sunSign: 'Aries',
        popularity: 98,
      },
    ];

    for (const personData of samplePeople) {
      const existing = await this.famousRepository.findOne({
        where: { name: personData.name },
      });

      if (!existing) {
        const person = this.famousRepository.create(personData);
        await this.famousRepository.save(person);
      }
    }
  }
}
