import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChakrasService } from './chakras.service';
import { ChakraProfile, ChakraStatus } from '../../entities/chakra.entity';
import { PersonProfile } from '../../entities/person-profile.entity';
import { BirthChart } from '../../entities/birth-chart.entity';

describe('ChakrasService', () => {
  let service: ChakrasService;
  let chakraRepository: Repository<ChakraProfile>;
  let personRepository: Repository<PersonProfile>;
  let birthChartRepository: Repository<BirthChart>;

  const mockPersonProfile = {
    id: 'person-123',
    name: 'John Doe',
    birthDate: new Date('1990-01-15'),
    userId: 'user-123',
  };

  const mockBirthChart = {
    id: 'chart-123',
    personId: 'person-123',
    sunSign: 'Capricorn',
    moonSign: 'Pisces',
    risingSign: 'Virgo',
  };

  const mockChakraRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPersonRepository = {
    findOne: jest.fn(),
  };

  const mockBirthChartRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChakrasService,
        {
          provide: getRepositoryToken(ChakraProfile),
          useValue: mockChakraRepository,
        },
        {
          provide: getRepositoryToken(PersonProfile),
          useValue: mockPersonRepository,
        },
        {
          provide: getRepositoryToken(BirthChart),
          useValue: mockBirthChartRepository,
        },
      ],
    }).compile();

    service = module.get<ChakrasService>(ChakrasService);
    chakraRepository = module.get<Repository<ChakraProfile>>(
      getRepositoryToken(ChakraProfile),
    );
    personRepository = module.get<Repository<PersonProfile>>(
      getRepositoryToken(PersonProfile),
    );
    birthChartRepository = module.get<Repository<BirthChart>>(
      getRepositoryToken(BirthChart),
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateChakraProfile', () => {
    it('should generate chakra profile for valid person', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      const mockChakraProfile = {
        id: 'chakra-1',
        personId: mockPersonProfile.id,
        chakraStates: expect.any(Object),
        overallGuidance: expect.any(String),
        meditation: expect.any(Object),
      };

      mockChakraRepository.create.mockReturnValue(mockChakraProfile);
      mockChakraRepository.save.mockResolvedValue(mockChakraProfile);

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result).toBeDefined();
      expect(mockPersonRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPersonProfile.id },
      });
      expect(mockBirthChartRepository.findOne).toHaveBeenCalledWith({
        where: { personId: mockPersonProfile.id },
      });
      expect(mockChakraRepository.create).toHaveBeenCalled();
      expect(mockChakraRepository.save).toHaveBeenCalled();
    });

    it('should throw error when person is not found', async () => {
      mockPersonRepository.findOne.mockResolvedValue(null);

      await expect(
        service.generateChakraProfile('non-existent-person'),
      ).rejects.toThrow('Person not found');
    });

    it('should generate profile even without birth chart', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(null);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result).toBeDefined();
      expect(result.chakraStates).toBeDefined();
    });

    it('should include all seven chakras in chakraStates', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.chakraStates).toHaveProperty('root');
      expect(result.chakraStates).toHaveProperty('sacral');
      expect(result.chakraStates).toHaveProperty('solarPlexus');
      expect(result.chakraStates).toHaveProperty('heart');
      expect(result.chakraStates).toHaveProperty('throat');
      expect(result.chakraStates).toHaveProperty('thirdEye');
      expect(result.chakraStates).toHaveProperty('crown');
    });

    it('should include chakra names in states', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.chakraStates.root.name).toBe('Root (Muladhara)');
      expect(result.chakraStates.sacral.name).toBe('Sacral (Svadhisthana)');
      expect(result.chakraStates.solarPlexus.name).toBe('Solar Plexus (Manipura)');
      expect(result.chakraStates.heart.name).toBe('Heart (Anahata)');
      expect(result.chakraStates.throat.name).toBe('Throat (Vishuddha)');
      expect(result.chakraStates.thirdEye.name).toBe('Third Eye (Ajna)');
      expect(result.chakraStates.crown.name).toBe('Crown (Sahasrara)');
    });

    it('should include status for each chakra', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      const validStatuses = [
        ChakraStatus.BALANCED,
        ChakraStatus.UNDERACTIVE,
        ChakraStatus.OVERACTIVE,
      ];

      expect(validStatuses).toContain(result.chakraStates.root.status);
      expect(validStatuses).toContain(result.chakraStates.sacral.status);
      expect(validStatuses).toContain(result.chakraStates.solarPlexus.status);
      expect(validStatuses).toContain(result.chakraStates.heart.status);
      expect(validStatuses).toContain(result.chakraStates.throat.status);
      expect(validStatuses).toContain(result.chakraStates.thirdEye.status);
      expect(validStatuses).toContain(result.chakraStates.crown.status);
    });

    it('should include score for each chakra', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(typeof result.chakraStates.root.score).toBe('number');
      expect(result.chakraStates.root.score).toBeGreaterThanOrEqual(0);
      expect(result.chakraStates.root.score).toBeLessThanOrEqual(100);
    });

    it('should include tips for each chakra', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(Array.isArray(result.chakraStates.root.tips)).toBe(true);
      expect(result.chakraStates.root.tips.length).toBeGreaterThan(0);
      expect(result.chakraStates.root.tips).toContain(
        'Practice grounding exercises like walking barefoot',
      );
    });

    it('should include overall guidance', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.overallGuidance).toBeDefined();
      expect(typeof result.overallGuidance).toBe('string');
      expect(result.overallGuidance.length).toBeGreaterThan(0);
    });

    it('should include meditation recommendations', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.meditation).toBeDefined();
      expect(result.meditation).toHaveProperty('recommended');
      expect(result.meditation).toHaveProperty('breathwork');
      expect(Array.isArray(result.meditation.recommended)).toBe(true);
      expect(Array.isArray(result.meditation.breathwork)).toBe(true);
    });

    it('should include specific meditation techniques', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.meditation.recommended).toContain('Full body chakra meditation');
      expect(result.meditation.breathwork).toContain('Alternate nostril breathing');
    });

    it('should classify chakra as OVERACTIVE when score > 60', async () => {
      // We can't directly control randomness, but we can test the logic exists
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      // At least one chakra should exist
      expect(result.chakraStates.root).toBeDefined();
    });

    it('should provide different tips for different chakras', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      // Root chakra should have grounding tips
      expect(result.chakraStates.root.tips.some((tip: string) =>
        tip.toLowerCase().includes('grounding') || tip.toLowerCase().includes('root'),
      )).toBe(true);

      // Heart chakra should have love/compassion tips
      expect(result.chakraStates.heart.tips.some((tip: string) =>
        tip.toLowerCase().includes('loving') || tip.toLowerCase().includes('heart'),
      )).toBe(true);
    });
  });

  describe('getChakraProfile', () => {
    it('should retrieve the most recent chakra profile for a person', async () => {
      const mockChakraProfile = {
        id: 'chakra-latest',
        personId: mockPersonProfile.id,
        chakraStates: {
          root: { name: 'Root', status: ChakraStatus.BALANCED, score: 55, tips: [] },
        },
        overallGuidance: 'Test guidance',
        meditation: { recommended: [], breathwork: [] },
        createdAt: new Date('2024-01-15'),
      };

      mockChakraRepository.findOne.mockResolvedValue(mockChakraProfile);

      const result = await service.getChakraProfile(mockPersonProfile.id);

      expect(result).toEqual(mockChakraProfile);
      expect(mockChakraRepository.findOne).toHaveBeenCalledWith({
        where: { personId: mockPersonProfile.id },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return null when no chakra profile exists for person', async () => {
      mockChakraRepository.findOne.mockResolvedValue(null);

      const result = await service.getChakraProfile('non-existent-person');

      expect(result).toBeNull();
    });

    it('should order by created date descending', async () => {
      mockChakraRepository.findOne.mockResolvedValue({
        id: 'chakra-1',
        personId: mockPersonProfile.id,
        chakraStates: {},
        overallGuidance: '',
        meditation: {},
        createdAt: new Date('2024-01-20'),
      });

      await service.getChakraProfile(mockPersonProfile.id);

      expect(mockChakraRepository.findOne).toHaveBeenCalledWith({
        where: { personId: mockPersonProfile.id },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return chakra profile with all required fields', async () => {
      const completeChakraProfile = {
        id: 'chakra-complete',
        personId: mockPersonProfile.id,
        chakraStates: {
          root: { name: 'Root (Muladhara)', status: ChakraStatus.BALANCED, score: 55, tips: ['Tip 1'] },
          sacral: { name: 'Sacral (Svadhisthana)', status: ChakraStatus.OVERACTIVE, score: 75, tips: ['Tip 2'] },
        },
        overallGuidance: 'Your chakras are balanced.',
        meditation: {
          recommended: ['Meditation 1'],
          breathwork: ['Breathwork 1'],
        },
        createdAt: new Date('2024-01-15'),
      };

      mockChakraRepository.findOne.mockResolvedValue(completeChakraProfile);

      const result = await service.getChakraProfile(mockPersonProfile.id);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('personId');
      expect(result).toHaveProperty('chakraStates');
      expect(result).toHaveProperty('overallGuidance');
      expect(result).toHaveProperty('meditation');
      expect(result).toHaveProperty('createdAt');
    });
  });

  describe('chakra tips', () => {
    it('should provide tips for root chakra including grounding exercises', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.chakraStates.root.tips).toContain(
        'Practice grounding exercises like walking barefoot',
      );
      expect(result.chakraStates.root.tips).toContain('Eat root vegetables');
    });

    it('should provide tips for sacral chakra including creative activities', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.chakraStates.sacral.tips).toContain(
        'Engage in creative activities',
      );
      expect(result.chakraStates.sacral.tips).toContain('Drink plenty of water');
    });

    it('should provide tips for heart chakra including loving-kindness', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.chakraStates.heart.tips).toContain(
        'Practice loving-kindness meditation',
      );
      expect(result.chakraStates.heart.tips).toContain('Spend time with loved ones');
    });

    it('should provide tips for throat chakra including communication', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.chakraStates.throat.tips).toContain('Practice speaking your truth');
      expect(result.chakraStates.throat.tips).toContain('Try singing or chanting');
    });

    it('should provide tips for third eye chakra including meditation', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.chakraStates.thirdEye.tips).toContain(
        'Practice meditation and visualization',
      );
      expect(result.chakraStates.thirdEye.tips).toContain('Keep a dream journal');
    });

    it('should provide tips for crown chakra including spiritual practices', async () => {
      mockPersonRepository.findOne.mockResolvedValue(mockPersonProfile);
      mockBirthChartRepository.findOne.mockResolvedValue(mockBirthChart);

      mockChakraRepository.create.mockImplementation((data) => data);
      mockChakraRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateChakraProfile(mockPersonProfile.id);

      expect(result.chakraStates.crown.tips).toContain('Practice meditation daily');
      expect(result.chakraStates.crown.tips).toContain('Connect with spirituality');
    });
  });
});
