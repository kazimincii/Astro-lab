import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartsService } from './charts.service';
import { BirthChart } from '../../entities/birth-chart.entity';

describe('ChartsService', () => {
  let service: ChartsService;
  let chartsRepository: Repository<BirthChart>;

  const mockChartsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChartsService,
        {
          provide: getRepositoryToken(BirthChart),
          useValue: mockChartsRepository,
        },
      ],
    }).compile();

    service = module.get<ChartsService>(ChartsService);
    chartsRepository = module.get<Repository<BirthChart>>(getRepositoryToken(BirthChart));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(chartsRepository).toBeDefined();
  });

  describe('generate', () => {
    it('should generate and save a birth chart for a profile', async () => {
      const profileId = 'profile-1';
      const mockChart = {
        id: 'chart-1',
        profile: { id: profileId },
        planets: {},
        houses: {},
        aspects: [],
        basicInterpretation: 'Chart generated successfully',
      };

      mockChartsRepository.create.mockReturnValue(mockChart);
      mockChartsRepository.save.mockResolvedValue(mockChart);

      const result = await service.generate(profileId);

      expect(mockChartsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          profile: { id: profileId },
          planets: {},
          houses: {},
          aspects: [],
          basicInterpretation: 'Chart generated successfully',
        }),
      );
      expect(mockChartsRepository.save).toHaveBeenCalledWith(mockChart);
      expect(result).toBe(mockChart);
    });
  });

  describe('findByProfile', () => {
    it('should find a birth chart by profile ID', async () => {
      const profileId = 'profile-1';
      const mockChart = {
        id: 'chart-1',
        profile: { id: profileId },
        planets: { sun: { sign: 'Aries' } },
        houses: {},
        aspects: [],
      };

      mockChartsRepository.findOne.mockResolvedValue(mockChart);

      const result = await service.findByProfile(profileId);

      expect(mockChartsRepository.findOne).toHaveBeenCalledWith({
        where: { profile: { id: profileId } },
      });
      expect(result).toBe(mockChart);
    });

    it('should return null if no chart exists for profile', async () => {
      mockChartsRepository.findOne.mockResolvedValue(null);

      const result = await service.findByProfile('nonexistent-profile');

      expect(result).toBeNull();
    });
  });

  describe('getDetailedInterpretation', () => {
    it('should return detailed chart interpretation by chart ID', async () => {
      const chartId = 'chart-1';
      const mockChart = {
        id: chartId,
        profile: { id: 'profile-1' },
        planets: { sun: { sign: 'Leo' } },
        houses: {},
        aspects: [],
        basicInterpretation: 'Sun in Leo',
      };

      mockChartsRepository.findOne.mockResolvedValue(mockChart);

      const result = await service.getDetailedInterpretation(chartId);

      expect(mockChartsRepository.findOne).toHaveBeenCalledWith({
        where: { id: chartId },
      });
      expect(result).toBe(mockChart);
    });

    it('should return null if chart does not exist', async () => {
      mockChartsRepository.findOne.mockResolvedValue(null);

      const result = await service.getDetailedInterpretation('nonexistent-chart');

      expect(result).toBeNull();
    });
  });
});
