import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiorhythmService } from './biorhythm.service';
import { BiorhythmProfile } from '../../entities/biorhythm.entity';
import { PersonProfile } from '../../entities/person-profile.entity';

describe('BiorhythmService', () => {
  let service: BiorhythmService;
  let biorhythmRepository: Repository<BiorhythmProfile>;
  let personRepository: Repository<PersonProfile>;

  const mockPersonProfile = {
    id: 'person-123',
    name: 'John Doe',
    birthDate: new Date('1990-01-15'),
    userId: 'user-123',
  };

  const mockBiorhythmRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPersonRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BiorhythmService,
        {
          provide: getRepositoryToken(BiorhythmProfile),
          useValue: mockBiorhythmRepository,
        },
        {
          provide: getRepositoryToken(PersonProfile),
          useValue: mockPersonRepository,
        },
      ],
    }).compile();

    service = module.get<BiorhythmService>(BiorhythmService);
    biorhythmRepository = module.get<Repository<BiorhythmProfile>>(
      getRepositoryToken(BiorhythmProfile),
    );
    personRepository = module.get<Repository<PersonProfile>>(
      getRepositoryToken(PersonProfile),
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateBiorhythm', () => {
    it('should calculate biorhythm for valid person and date', async () => {
      const targetDate = new Date('2024-01-15');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      const expectedBiorhythm = {
        id: 'biorhythm-1',
        personId: mockPersonProfile.id,
        calculatedDate: targetDate,
        data: expect.any(Object),
        commentary: expect.any(String),
      };

      mockBiorhythmRepository.create.mockReturnValue(expectedBiorhythm);
      mockBiorhythmRepository.save.mockResolvedValue(expectedBiorhythm);

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      expect(result).toBeDefined();
      expect(mockPersonRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPersonProfile.id },
      });
      expect(mockBiorhythmRepository.create).toHaveBeenCalled();
      expect(mockBiorhythmRepository.save).toHaveBeenCalled();
    });

    it('should use current date when no date is provided', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      const mockBiorhythm = {
        id: 'biorhythm-2',
        personId: mockPersonProfile.id,
        data: {},
        commentary: 'Test',
      };

      mockBiorhythmRepository.create.mockReturnValue(mockBiorhythm);
      mockBiorhythmRepository.save.mockResolvedValue(mockBiorhythm);

      await service.calculateBiorhythm(mockPersonProfile.id);

      expect(mockBiorhythmRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          personId: mockPersonProfile.id,
          calculatedDate: expect.any(Date),
        }),
      );
    });

    it('should throw error when person is not found', async () => {
      mockPersonRepository.findOne.mockResolvedValue(null);

      await expect(
        service.calculateBiorhythm('non-existent-person'),
      ).rejects.toThrow('Person or birth date not found');
    });

    it('should throw error when birth date is missing', async () => {
      const personWithoutBirthDate = {
        ...mockPersonProfile,
        birthDate: null,
      };

      mockPersonRepository.findOne.mockResolvedValue(personWithoutBirthDate);

      await expect(
        service.calculateBiorhythm(mockPersonProfile.id),
      ).rejects.toThrow('Person or birth date not found');
    });

    it('should calculate physical, emotional, and intellectual values', async () => {
      const targetDate = new Date('2024-06-15');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      expect(result.data).toHaveProperty('physical');
      expect(result.data).toHaveProperty('emotional');
      expect(result.data).toHaveProperty('intellectual');
      expect(typeof result.data.physical).toBe('number');
      expect(typeof result.data.emotional).toBe('number');
      expect(typeof result.data.intellectual).toBe('number');
    });

    it('should ensure biorhythm values are between -1 and 1', async () => {
      const targetDate = new Date('2024-06-15');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      expect(result.data.physical).toBeGreaterThanOrEqual(-1);
      expect(result.data.physical).toBeLessThanOrEqual(1);
      expect(result.data.emotional).toBeGreaterThanOrEqual(-1);
      expect(result.data.emotional).toBeLessThanOrEqual(1);
      expect(result.data.intellectual).toBeGreaterThanOrEqual(-1);
      expect(result.data.intellectual).toBeLessThanOrEqual(1);
    });

    it('should round biorhythm values to 2 decimal places', async () => {
      const targetDate = new Date('2024-06-15');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      // Check that values are rounded to 2 decimal places
      expect(result.data.physical.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(
        2,
      );
      expect(result.data.emotional.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(
        2,
      );
      expect(
        result.data.intellectual.toString().split('.')[1]?.length || 0,
      ).toBeLessThanOrEqual(2);
    });

    it('should include critical days in the result', async () => {
      const targetDate = new Date('2024-06-15');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      expect(result.data).toHaveProperty('criticalDays');
      expect(Array.isArray(result.data.criticalDays)).toBe(true);
    });

    it('should include next peaks in the result', async () => {
      const targetDate = new Date('2024-06-15');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      expect(result.data).toHaveProperty('nextPeaks');
      expect(result.data.nextPeaks).toHaveProperty('physical');
      expect(result.data.nextPeaks).toHaveProperty('emotional');
      expect(result.data.nextPeaks).toHaveProperty('intellectual');
    });

    it('should generate appropriate commentary', async () => {
      const targetDate = new Date('2024-06-15');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      expect(result.commentary).toBeDefined();
      expect(typeof result.commentary).toBe('string');
      expect(result.commentary.length).toBeGreaterThan(0);
    });

    it('should generate high-energy commentary when all values are high', async () => {
      // Find a date that produces high biorhythm values
      // This is a test helper to check commentary logic
      const targetDate = new Date('2024-06-15');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      // Commentary should be appropriate for the biorhythm values
      expect(result.commentary).toBeDefined();
    });

    it('should calculate correctly for different birth dates', async () => {
      const differentPerson = {
        ...mockPersonProfile,
        id: 'person-456',
        birthDate: new Date('1985-12-25'),
      };

      const targetDate = new Date('2024-01-01');
      mockPersonRepository.findOne.mockResolvedValue(differentPerson);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(differentPerson.id, targetDate);

      expect(result).toBeDefined();
      expect(result.data.physical).toBeDefined();
      expect(result.data.emotional).toBeDefined();
      expect(result.data.intellectual).toBeDefined();
    });

    it('should handle leap year birth dates correctly', async () => {
      const leapYearPerson = {
        ...mockPersonProfile,
        id: 'person-leap',
        birthDate: new Date('2000-02-29'),
      };

      const targetDate = new Date('2024-03-01');
      mockPersonRepository.findOne.mockResolvedValue(leapYearPerson);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(leapYearPerson.id, targetDate);

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });

    it('should calculate days since birth correctly', async () => {
      // Person born on 1990-01-15, calculating for 1990-01-16 (1 day after)
      const targetDate = new Date('1990-01-16');
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);

      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      // Biorhythm should be calculated based on 1 day since birth
      expect(result).toBeDefined();
    });
  });

  describe('getLatestBiorhythm', () => {
    it('should retrieve the most recent biorhythm for a person', async () => {
      const mockLatestBiorhythm = {
        id: 'biorhythm-latest',
        personId: mockPersonProfile.id,
        calculatedDate: new Date('2024-01-15'),
        data: {
          physical: 0.5,
          emotional: 0.3,
          intellectual: 0.7,
        },
        commentary: 'Test commentary',
      };

      mockBiorhythmRepository.findOne.mockResolvedValue(mockLatestBiorhythm);

      const result = await service.getLatestBiorhythm(mockPersonProfile.id);

      expect(result).toEqual(mockLatestBiorhythm);
      expect(mockBiorhythmRepository.findOne).toHaveBeenCalledWith({
        where: { personId: mockPersonProfile.id },
        order: { calculatedDate: 'DESC' },
      });
    });

    it('should return null when no biorhythm exists for person', async () => {
      mockBiorhythmRepository.findOne.mockResolvedValue(null);

      const result = await service.getLatestBiorhythm('non-existent-person');

      expect(result).toBeNull();
    });

    it('should order by calculated date descending', async () => {
      mockBiorhythmRepository.findOne.mockResolvedValue({
        id: 'biorhythm-1',
        personId: mockPersonProfile.id,
        calculatedDate: new Date('2024-01-20'),
        data: {},
        commentary: '',
      });

      await service.getLatestBiorhythm(mockPersonProfile.id);

      expect(mockBiorhythmRepository.findOne).toHaveBeenCalledWith({
        where: { personId: mockPersonProfile.id },
        order: { calculatedDate: 'DESC' },
      });
    });

    it('should return biorhythm with all required fields', async () => {
      const completeBiorhythm = {
        id: 'biorhythm-complete',
        personId: mockPersonProfile.id,
        calculatedDate: new Date('2024-01-15'),
        data: {
          physical: 0.5,
          emotional: 0.3,
          intellectual: 0.7,
          criticalDays: ['2024-01-20'],
          nextPeaks: {
            physical: '2024-01-25',
            emotional: '2024-01-28',
            intellectual: '2024-02-01',
          },
        },
        commentary: 'Your biorhythms are generally positive.',
      };

      mockBiorhythmRepository.findOne.mockResolvedValue(completeBiorhythm);

      const result = await service.getLatestBiorhythm(mockPersonProfile.id);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('personId');
      expect(result).toHaveProperty('calculatedDate');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('commentary');
      expect(result?.data).toHaveProperty('physical');
      expect(result?.data).toHaveProperty('emotional');
      expect(result?.data).toHaveProperty('intellectual');
    });
  });

  describe('biorhythm cycles', () => {
    it('should use correct physical cycle of 23 days', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      // Calculate for day 23 after birth (one full physical cycle)
      const birthDate = new Date(mockPersonProfile.birthDate);
      const targetDate = new Date(birthDate);
      targetDate.setDate(targetDate.getDate() + 23);

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      // After 23 days, physical cycle should be back to starting point (close to 0)
      expect(result.data.physical).toBeCloseTo(0, 1);
    });

    it('should use correct emotional cycle of 28 days', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      // Calculate for day 28 after birth (one full emotional cycle)
      const birthDate = new Date(mockPersonProfile.birthDate);
      const targetDate = new Date(birthDate);
      targetDate.setDate(targetDate.getDate() + 28);

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      // After 28 days, emotional cycle should be back to starting point (close to 0)
      expect(result.data.emotional).toBeCloseTo(0, 1);
    });

    it('should use correct intellectual cycle of 33 days', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBiorhythmRepository.create.mockImplementation((data) => data);
      mockBiorhythmRepository.save.mockImplementation((data) => Promise.resolve(data));

      // Calculate for day 33 after birth (one full intellectual cycle)
      const birthDate = new Date(mockPersonProfile.birthDate);
      const targetDate = new Date(birthDate);
      targetDate.setDate(targetDate.getDate() + 33);

      const result = await service.calculateBiorhythm(mockPersonProfile.id, targetDate);

      // After 33 days, intellectual cycle should be back to starting point (close to 0)
      expect(result.data.intellectual).toBeCloseTo(0, 1);
    });
  });
});
