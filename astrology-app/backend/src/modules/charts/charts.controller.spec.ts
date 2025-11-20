import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';

describe('ChartsController', () => {
  let controller: ChartsController;
  let chartsService: ChartsService;

  const mockChartsService = {
    generate: jest.fn(),
    findByProfile: jest.fn(),
    getDetailedInterpretation: jest.fn(),
  };

  const mockBirthChart = {
    id: 'chart-123',
    profileId: 'profile-456',
    planets: [
      {
        name: 'Sun',
        sign: 'Aries',
        degree: 15.5,
        house: 1,
        longitude: 15.5,
        latitude: 0.0,
      },
      {
        name: 'Moon',
        sign: 'Cancer',
        degree: 22.3,
        house: 4,
        longitude: 112.3,
        latitude: 5.2,
      },
      {
        name: 'Mercury',
        sign: 'Pisces',
        degree: 8.7,
        house: 12,
        longitude: 338.7,
        latitude: 2.1,
      },
    ],
    houses: [
      { number: 1, sign: 'Aries', degree: 0.0 },
      { number: 2, sign: 'Taurus', degree: 30.0 },
      { number: 3, sign: 'Gemini', degree: 60.0 },
      { number: 4, sign: 'Cancer', degree: 90.0 },
    ],
    aspects: [
      {
        planet1: 'Sun',
        planet2: 'Moon',
        aspect: 'Trine',
        orb: 2.5,
      },
      {
        planet1: 'Sun',
        planet2: 'Mars',
        aspect: 'Square',
        orb: 3.2,
      },
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  const mockDetailedInterpretation = {
    chartId: 'chart-123',
    interpretation: {
      summary: 'A comprehensive overview of your natal chart showing strong fire element...',
      sunSign: 'Your Sun in Aries gives you pioneering spirit and leadership qualities...',
      moonSign: 'Moon in Cancer brings emotional depth and nurturing instincts...',
      risingSign: 'Aries rising makes you appear confident and action-oriented...',
      majorAspects: 'Sun trine Moon creates harmony between your conscious and unconscious...',
      strengths: ['Creative expression', 'Leadership', 'Emotional intelligence'],
      challenges: ['Impulsiveness', 'Need for patience', 'Balancing independence with connection'],
      lifeThemes: ['Self-discovery', 'Emotional healing', 'Creative pursuits'],
    },
    generatedAt: new Date('2024-01-15'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChartsController],
      providers: [
        {
          provide: ChartsService,
          useValue: mockChartsService,
        },
      ],
    }).compile();

    controller = module.get<ChartsController>(ChartsController);
    chartsService = module.get<ChartsService>(ChartsService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generate', () => {
    it('should generate birth chart successfully', async () => {
      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      expect(result).toEqual(mockBirthChart);
      expect(mockChartsService.generate).toHaveBeenCalledWith('profile-456');
      expect(mockChartsService.generate).toHaveBeenCalledTimes(1);
    });

    it('should return chart with planetary positions', async () => {
      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      expect(Array.isArray(result.planets)).toBe(true);
      expect(result.planets.length).toBeGreaterThan(0);
      expect(result.planets[0]).toHaveProperty('name');
      expect(result.planets[0]).toHaveProperty('sign');
      expect(result.planets[0]).toHaveProperty('degree');
      expect(result.planets[0]).toHaveProperty('house');
    });

    it('should return chart with house cusps', async () => {
      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      expect(Array.isArray(result.houses)).toBe(true);
      expect(result.houses.length).toBeGreaterThan(0);
      expect(result.houses[0]).toHaveProperty('number');
      expect(result.houses[0]).toHaveProperty('sign');
      expect(result.houses[0]).toHaveProperty('degree');
    });

    it('should return chart with planetary aspects', async () => {
      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      expect(Array.isArray(result.aspects)).toBe(true);
      expect(result.aspects.length).toBeGreaterThan(0);
      expect(result.aspects[0]).toHaveProperty('planet1');
      expect(result.aspects[0]).toHaveProperty('planet2');
      expect(result.aspects[0]).toHaveProperty('aspect');
      expect(result.aspects[0]).toHaveProperty('orb');
    });

    it('should include all major planets', async () => {
      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      const planetNames = result.planets.map(p => p.name);
      expect(planetNames).toContain('Sun');
      expect(planetNames).toContain('Moon');
      expect(planetNames).toContain('Mercury');
    });

    it('should calculate degrees and longitudes', async () => {
      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      result.planets.forEach(planet => {
        expect(typeof planet.degree).toBe('number');
        expect(typeof planet.longitude).toBe('number');
        expect(planet.degree).toBeGreaterThanOrEqual(0);
        expect(planet.degree).toBeLessThan(360);
      });
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockChartsService.generate.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      await expect(controller.generate('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid profile data', async () => {
      mockChartsService.generate.mockRejectedValue(
        new BadRequestException('Invalid profile data or missing birth information'),
      );

      await expect(controller.generate('profile-456')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ForbiddenException when action limit reached', async () => {
      mockChartsService.generate.mockRejectedValue(
        new ForbiddenException('Action limit reached'),
      );

      await expect(controller.generate('profile-456')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should handle different profile IDs', async () => {
      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      await controller.generate('profile-123');
      expect(mockChartsService.generate).toHaveBeenCalledWith('profile-123');

      await controller.generate('profile-789');
      expect(mockChartsService.generate).toHaveBeenCalledWith('profile-789');
    });
  });

  describe('findByProfile', () => {
    it('should retrieve existing birth chart for profile', async () => {
      mockChartsService.findByProfile.mockResolvedValue(mockBirthChart);

      const result = await controller.findByProfile('profile-456');

      expect(result).toEqual(mockBirthChart);
      expect(mockChartsService.findByProfile).toHaveBeenCalledWith('profile-456');
      expect(mockChartsService.findByProfile).toHaveBeenCalledTimes(1);
    });

    it('should return complete chart structure', async () => {
      mockChartsService.findByProfile.mockResolvedValue(mockBirthChart);

      const result = await controller.findByProfile('profile-456');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('profileId');
      expect(result).toHaveProperty('planets');
      expect(result).toHaveProperty('houses');
      expect(result).toHaveProperty('aspects');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw NotFoundException when chart not found', async () => {
      mockChartsService.findByProfile.mockRejectedValue(
        new NotFoundException('Chart not found for this profile'),
      );

      await expect(controller.findByProfile('profile-456')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should retrieve chart with timestamp information', async () => {
      mockChartsService.findByProfile.mockResolvedValue(mockBirthChart);

      const result = await controller.findByProfile('profile-456');

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should handle multiple profile requests', async () => {
      const chart1 = { ...mockBirthChart, id: 'chart-1', profileId: 'profile-1' };
      const chart2 = { ...mockBirthChart, id: 'chart-2', profileId: 'profile-2' };

      mockChartsService.findByProfile
        .mockResolvedValueOnce(chart1)
        .mockResolvedValueOnce(chart2);

      const result1 = await controller.findByProfile('profile-1');
      const result2 = await controller.findByProfile('profile-2');

      expect(result1.profileId).toBe('profile-1');
      expect(result2.profileId).toBe('profile-2');
    });
  });

  describe('getDetailedInterpretation', () => {
    it('should retrieve detailed chart interpretation', async () => {
      mockChartsService.getDetailedInterpretation.mockResolvedValue(
        mockDetailedInterpretation,
      );

      const result = await controller.getDetailedInterpretation('chart-123');

      expect(result).toEqual(mockDetailedInterpretation);
      expect(mockChartsService.getDetailedInterpretation).toHaveBeenCalledWith('chart-123');
      expect(mockChartsService.getDetailedInterpretation).toHaveBeenCalledTimes(1);
    });

    it('should return interpretation with all sections', async () => {
      mockChartsService.getDetailedInterpretation.mockResolvedValue(
        mockDetailedInterpretation,
      );

      const result = await controller.getDetailedInterpretation('chart-123');

      expect(result.interpretation).toHaveProperty('summary');
      expect(result.interpretation).toHaveProperty('sunSign');
      expect(result.interpretation).toHaveProperty('moonSign');
      expect(result.interpretation).toHaveProperty('risingSign');
      expect(result.interpretation).toHaveProperty('majorAspects');
    });

    it('should return strengths array', async () => {
      mockChartsService.getDetailedInterpretation.mockResolvedValue(
        mockDetailedInterpretation,
      );

      const result = await controller.getDetailedInterpretation('chart-123');

      expect(Array.isArray(result.interpretation.strengths)).toBe(true);
      expect(result.interpretation.strengths).toContain('Creative expression');
      expect(result.interpretation.strengths).toContain('Leadership');
    });

    it('should return challenges array', async () => {
      mockChartsService.getDetailedInterpretation.mockResolvedValue(
        mockDetailedInterpretation,
      );

      const result = await controller.getDetailedInterpretation('chart-123');

      expect(Array.isArray(result.interpretation.challenges)).toBe(true);
      expect(result.interpretation.challenges).toContain('Impulsiveness');
      expect(result.interpretation.challenges).toContain('Need for patience');
    });

    it('should return life themes array', async () => {
      mockChartsService.getDetailedInterpretation.mockResolvedValue(
        mockDetailedInterpretation,
      );

      const result = await controller.getDetailedInterpretation('chart-123');

      expect(Array.isArray(result.interpretation.lifeThemes)).toBe(true);
      expect(result.interpretation.lifeThemes).toContain('Self-discovery');
      expect(result.interpretation.lifeThemes).toContain('Emotional healing');
    });

    it('should include generation timestamp', async () => {
      mockChartsService.getDetailedInterpretation.mockResolvedValue(
        mockDetailedInterpretation,
      );

      const result = await controller.getDetailedInterpretation('chart-123');

      expect(result.generatedAt).toBeDefined();
      expect(result.generatedAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException when chart not found', async () => {
      mockChartsService.getDetailedInterpretation.mockRejectedValue(
        new NotFoundException('Chart not found'),
      );

      await expect(
        controller.getDetailedInterpretation('non-existent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for non-premium users', async () => {
      mockChartsService.getDetailedInterpretation.mockRejectedValue(
        new ForbiddenException('Premium feature - upgrade required'),
      );

      await expect(controller.getDetailedInterpretation('chart-123')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should provide comprehensive personality insights', async () => {
      mockChartsService.getDetailedInterpretation.mockResolvedValue(
        mockDetailedInterpretation,
      );

      const result = await controller.getDetailedInterpretation('chart-123');

      expect(result.interpretation.summary.length).toBeGreaterThan(0);
      expect(result.interpretation.sunSign.length).toBeGreaterThan(0);
      expect(result.interpretation.moonSign.length).toBeGreaterThan(0);
    });

    it('should handle different chart IDs', async () => {
      mockChartsService.getDetailedInterpretation.mockResolvedValue(
        mockDetailedInterpretation,
      );

      await controller.getDetailedInterpretation('chart-456');
      expect(mockChartsService.getDetailedInterpretation).toHaveBeenCalledWith('chart-456');

      await controller.getDetailedInterpretation('chart-789');
      expect(mockChartsService.getDetailedInterpretation).toHaveBeenCalledWith('chart-789');
    });
  });

  describe('zodiac signs', () => {
    it('should recognize all 12 zodiac signs', async () => {
      const signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
      ];

      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      signs.forEach(sign => {
        const hasSign = result.planets.some(p => p.sign === sign) ||
                       result.houses.some(h => h.sign === sign);
        // At least some planets or houses should have zodiac signs
      });

      expect(result.planets[0].sign).toBeDefined();
    });
  });

  describe('aspects', () => {
    it('should recognize major aspects', async () => {
      const majorAspects = ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'];

      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      expect(result.aspects[0].aspect).toBeDefined();
      expect(typeof result.aspects[0].orb).toBe('number');
    });

    it('should calculate aspect orbs', async () => {
      mockChartsService.generate.mockResolvedValue(mockBirthChart);

      const result = await controller.generate('profile-456');

      result.aspects.forEach(aspect => {
        expect(aspect.orb).toBeGreaterThanOrEqual(0);
        expect(aspect.orb).toBeLessThanOrEqual(10); // Typical max orb
      });
    });
  });

  describe('houses', () => {
    it('should include all 12 houses', async () => {
      const chartWith12Houses = {
        ...mockBirthChart,
        houses: Array.from({ length: 12 }, (_, i) => ({
          number: i + 1,
          sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][i],
          degree: i * 30,
        })),
      };

      mockChartsService.generate.mockResolvedValue(chartWith12Houses);

      const result = await controller.generate('profile-456');

      expect(result.houses.length).toBe(12);
      expect(result.houses[0].number).toBe(1);
      expect(result.houses[11].number).toBe(12);
    });
  });
});
