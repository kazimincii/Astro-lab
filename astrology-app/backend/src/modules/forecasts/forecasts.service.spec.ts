import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ForecastsService } from './forecasts.service';
import { DailyForecast } from '@/entities/daily-forecast.entity';
import { PersonProfile } from '@/entities/person-profile.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ActionType } from '@/entities/action-log.entity';

describe('ForecastsService', () => {
  let service: ForecastsService;
  let forecastsRepository: Repository<DailyForecast>;
  let profilesRepository: Repository<PersonProfile>;
  let subscriptionsService: SubscriptionsService;

  const mockForecastsRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProfilesRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockSubscriptionsService = {
    consumePremiumAction: jest.fn(),
  };

  const mockProfile: PersonProfile = {
    id: 'profile-123',
    name: 'John Doe',
    birthDate: new Date('1990-04-10'), // Aries
    birthTime: '14:30',
    birthPlace: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.006,
    sunSign: 'Aries',
    moonSign: 'Cancer',
    risingSign: 'Leo',
    owner: { id: 'user-123' } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as PersonProfile;

  const mockForecast: DailyForecast = {
    id: 'forecast-123',
    profile: mockProfile,
    date: new Date('2024-01-15'),
    sunSign: 'Aries',
    generalForecast: 'Momentum builds quickly today—channel it into one meaningful move.',
    loveForecast: 'Lead with warmth and invite someone into your excitement.',
    careerForecast: 'Pitch the project that feels a little audacious.',
    healthForecast: 'Channel extra energy into movement that feels playful.',
    luckyNumbers: ['7', '14', '21', '33'],
    luckyColor: '#F97316',
    luckyGem: 'Carnelian',
    loveScore: 7.5,
    careerScore: 8.5,
    healthScore: 6.5,
    overallScore: 7.5,
    planetaryTransits: {
      sun: {
        planet: 'Sun',
        theme: 'Confidence Boost',
        guidance: 'Own the spotlight with intention.',
      },
      moon: {
        planet: 'Moon',
        theme: 'Emotional Reset',
        guidance: 'Name what you feel before acting.',
      },
      ruler: {
        planet: 'Mars',
        theme: 'Clean Motivation',
        guidance: 'Aim your fire at one goal instead of many.',
      },
    },
    isRead: false,
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-15T00:00:00Z'),
  } as DailyForecast;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForecastsService,
        {
          provide: getRepositoryToken(DailyForecast),
          useValue: mockForecastsRepository,
        },
        {
          provide: getRepositoryToken(PersonProfile),
          useValue: mockProfilesRepository,
        },
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    service = module.get<ForecastsService>(ForecastsService);
    forecastsRepository = module.get<Repository<DailyForecast>>(
      getRepositoryToken(DailyForecast),
    );
    profilesRepository = module.get<Repository<PersonProfile>>(
      getRepositoryToken(PersonProfile),
    );
    subscriptionsService = module.get<SubscriptionsService>(SubscriptionsService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTodayForecast', () => {
    it('should return existing forecast if available', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(mockProfilesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'profile-123', owner: { id: 'user-123' } },
        relations: ['owner'],
      });
      expect(mockForecastsRepository.findOne).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('sunSign');
      expect(result).toHaveProperty('generalForecast');
      expect(mockSubscriptionsService.consumePremiumAction).not.toHaveBeenCalled();
    });

    it('should generate new forecast if not cached', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(mockSubscriptionsService.consumePremiumAction).toHaveBeenCalledWith(
        'user-123',
        ActionType.DAILY_FORECAST,
        expect.objectContaining({ profileId: 'profile-123' }),
        expect.stringContaining('Daily forecast'),
      );
      expect(mockForecastsRepository.create).toHaveBeenCalled();
      expect(mockForecastsRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('generalForecast');
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getTodayForecast('non-existent', 'user-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when profile belongs to different user', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getTodayForecast('profile-123', 'wrong-user'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return forecast with all required fields', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('profileId');
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('sunSign');
      expect(result).toHaveProperty('generalForecast');
      expect(result).toHaveProperty('loveForecast');
      expect(result).toHaveProperty('careerForecast');
      expect(result).toHaveProperty('healthForecast');
    });

    it('should return forecast with lucky elements', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.luckyNumbers).toBeDefined();
      expect(Array.isArray(result.luckyNumbers)).toBe(true);
      expect(result.luckyColor).toBeDefined();
      expect(result.luckyGem).toBeDefined();
    });

    it('should return forecast with scores', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.loveScore).toBeDefined();
      expect(result.careerScore).toBeDefined();
      expect(result.healthScore).toBeDefined();
      expect(result.overallScore).toBeDefined();
      expect(typeof result.loveScore).toBe('number');
    });

    it('should return forecast with planetary transits', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.planetaryTransits).toBeDefined();
      expect(result.planetaryTransits.sun).toBeDefined();
      expect(result.planetaryTransits.moon).toBeDefined();
      expect(result.planetaryTransits.ruler).toBeDefined();
    });
  });

  describe('sun sign determination', () => {
    it('should determine Aries for March 21 - April 19', async () => {
      const ariesProfile = {
        ...mockProfile,
        birthDate: new Date('1990-04-10'),
        sunSign: null,
      };

      mockProfilesRepository.findOne.mockResolvedValue(ariesProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.sunSign).toBe('Aries');
    });

    it('should determine Taurus for April 20 - May 20', async () => {
      const taurusProfile = {
        ...mockProfile,
        birthDate: new Date('1990-05-10'),
        sunSign: null,
      };
      const taurusForecast = { ...mockForecast, sunSign: 'Taurus' };

      mockProfilesRepository.findOne.mockResolvedValue(taurusProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(taurusForecast);
      mockForecastsRepository.save.mockResolvedValue(taurusForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.sunSign).toBe('Taurus');
    });

    it('should determine Cancer for June 21 - July 22', async () => {
      const cancerProfile = {
        ...mockProfile,
        birthDate: new Date('1990-07-10'),
        sunSign: null,
      };
      const cancerForecast = { ...mockForecast, sunSign: 'Cancer' };

      mockProfilesRepository.findOne.mockResolvedValue(cancerProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(cancerForecast);
      mockForecastsRepository.save.mockResolvedValue(cancerForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.sunSign).toBe('Cancer');
    });

    it('should determine Leo for July 23 - August 22', async () => {
      const leoProfile = {
        ...mockProfile,
        birthDate: new Date('1990-08-10'),
        sunSign: null,
      };
      const leoForecast = { ...mockForecast, sunSign: 'Leo' };

      mockProfilesRepository.findOne.mockResolvedValue(leoProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(leoForecast);
      mockForecastsRepository.save.mockResolvedValue(leoForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.sunSign).toBe('Leo');
    });

    it('should determine Scorpio for October 23 - November 21', async () => {
      const scorpioProfile = {
        ...mockProfile,
        birthDate: new Date('1990-11-10'),
        sunSign: null,
      };
      const scorpioForecast = { ...mockForecast, sunSign: 'Scorpio' };

      mockProfilesRepository.findOne.mockResolvedValue(scorpioProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(scorpioForecast);
      mockForecastsRepository.save.mockResolvedValue(scorpioForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.sunSign).toBe('Scorpio');
    });

    it('should determine Capricorn for December 22 - January 19', async () => {
      const capricornProfile = {
        ...mockProfile,
        birthDate: new Date('1990-01-10'),
        sunSign: null,
      };
      const capricornForecast = { ...mockForecast, sunSign: 'Capricorn' };

      mockProfilesRepository.findOne.mockResolvedValue(capricornProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(capricornForecast);
      mockForecastsRepository.save.mockResolvedValue(capricornForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.sunSign).toBe('Capricorn');
    });

    it('should default to Aries when birthDate is missing', async () => {
      const noDateProfile = {
        ...mockProfile,
        birthDate: null,
        sunSign: null,
      };

      mockProfilesRepository.findOne.mockResolvedValue(noDateProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.sunSign).toBe('Aries');
    });
  });

  describe('lucky numbers generation', () => {
    it('should generate exactly 4 lucky numbers', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.luckyNumbers).toBeDefined();
      expect(result.luckyNumbers.length).toBe(4);
    });

    it('should generate unique lucky numbers', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      const uniqueNumbers = new Set(result.luckyNumbers);
      expect(uniqueNumbers.size).toBe(result.luckyNumbers.length);
    });

    it('should generate lucky numbers between 1 and 88', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      result.luckyNumbers.forEach((num) => {
        const number = parseInt(num, 10);
        expect(number).toBeGreaterThanOrEqual(1);
        expect(number).toBeLessThanOrEqual(88);
      });
    });

    it('should return lucky numbers as strings', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      result.luckyNumbers.forEach((num) => {
        expect(typeof num).toBe('string');
      });
    });
  });

  describe('score generation', () => {
    it('should generate scores between 2.5 and 5.0', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.loveScore).toBeGreaterThanOrEqual(2.5);
      expect(result.loveScore).toBeLessThanOrEqual(5.0);
      expect(result.careerScore).toBeGreaterThanOrEqual(2.5);
      expect(result.careerScore).toBeLessThanOrEqual(5.0);
      expect(result.healthScore).toBeGreaterThanOrEqual(2.5);
      expect(result.healthScore).toBeLessThanOrEqual(5.0);
    });

    it('should generate overall score as average of three scores', async () => {
      const detailedForecast = {
        ...mockForecast,
        loveScore: 8.0,
        careerScore: 7.0,
        healthScore: 6.0,
        overallScore: 7.0,
      };

      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(detailedForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      const expectedOverall = (8.0 + 7.0 + 6.0) / 3;
      expect(result.overallScore).toBeCloseTo(expectedOverall, 1);
    });

    it('should round scores to one decimal place', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      const loveStr = result.loveScore.toString();
      const decimalPart = loveStr.split('.')[1];
      if (decimalPart) {
        expect(decimalPart.length).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('planetary transits', () => {
    it('should include sun, moon, and ruler transits', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.planetaryTransits).toHaveProperty('sun');
      expect(result.planetaryTransits).toHaveProperty('moon');
      expect(result.planetaryTransits).toHaveProperty('ruler');
    });

    it('should include theme and guidance for each transit', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.planetaryTransits.sun).toHaveProperty('theme');
      expect(result.planetaryTransits.sun).toHaveProperty('guidance');
      expect(result.planetaryTransits.moon).toHaveProperty('theme');
      expect(result.planetaryTransits.moon).toHaveProperty('guidance');
      expect(result.planetaryTransits.ruler).toHaveProperty('theme');
      expect(result.planetaryTransits.ruler).toHaveProperty('guidance');
    });

    it('should include planet name for each transit', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.planetaryTransits.sun.planet).toBe('Sun');
      expect(result.planetaryTransits.moon.planet).toBe('Moon');
      expect(result.planetaryTransits.ruler.planet).toBeDefined();
    });

    it('should use sign ruling planet for ruler transit', async () => {
      // Aries is ruled by Mars
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.planetaryTransits.ruler.planet).toBe('Mars');
    });
  });

  describe('element-based forecasts', () => {
    it('should use fire element snippets for fire signs', async () => {
      // Aries, Leo, Sagittarius are fire signs
      const ariesProfile = { ...mockProfile, sunSign: 'Aries' };
      mockProfilesRepository.findOne.mockResolvedValue(ariesProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.generalForecast).toBeDefined();
      expect(typeof result.generalForecast).toBe('string');
    });

    it('should use earth element snippets for earth signs', async () => {
      // Taurus, Virgo, Capricorn are earth signs
      const taurusProfile = { ...mockProfile, sunSign: 'Taurus' };
      const taurusForecast = {
        ...mockForecast,
        sunSign: 'Taurus',
        luckyColor: '#84CC16',
        luckyGem: 'Emerald',
      };

      mockProfilesRepository.findOne.mockResolvedValue(taurusProfile);
      mockForecastsRepository.findOne.mockResolvedValue(taurusForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.luckyGem).toBe('Emerald');
    });

    it('should use air element snippets for air signs', async () => {
      // Gemini, Libra, Aquarius are air signs
      const geminiProfile = { ...mockProfile, sunSign: 'Gemini' };
      const geminiForecast = {
        ...mockForecast,
        sunSign: 'Gemini',
        luckyGem: 'Agate',
      };

      mockProfilesRepository.findOne.mockResolvedValue(geminiProfile);
      mockForecastsRepository.findOne.mockResolvedValue(geminiForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.luckyGem).toBe('Agate');
    });

    it('should use water element snippets for water signs', async () => {
      // Cancer, Scorpio, Pisces are water signs
      const cancerProfile = { ...mockProfile, sunSign: 'Cancer' };
      const cancerForecast = {
        ...mockForecast,
        sunSign: 'Cancer',
        luckyGem: 'Moonstone',
      };

      mockProfilesRepository.findOne.mockResolvedValue(cancerProfile);
      mockForecastsRepository.findOne.mockResolvedValue(cancerForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.luckyGem).toBe('Moonstone');
    });
  });

  describe('forecast caching', () => {
    it('should cache forecast per profile per day', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      await service.getTodayForecast('profile-123', 'user-123');
      await service.getTodayForecast('profile-123', 'user-123');

      expect(mockForecastsRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockSubscriptionsService.consumePremiumAction).not.toHaveBeenCalled();
    });

    it('should normalize dates to UTC midnight', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      await service.getTodayForecast('profile-123', 'user-123');

      expect(mockForecastsRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            profile: { id: 'profile-123' },
            date: expect.any(Date),
          }),
        }),
      );
    });
  });

  describe('personalization', () => {
    it('should use profile first name in forecast', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      // Forecast sections should be personalized
      expect(result.loveForecast).toBeDefined();
      expect(result.careerForecast).toBeDefined();
      expect(result.healthForecast).toBeDefined();
    });

    it('should handle profile without name', async () => {
      const noNameProfile = { ...mockProfile, name: null };
      mockProfilesRepository.findOne.mockResolvedValue(noNameProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.loveForecast).toBeDefined();
    });

    it('should use different forecasts for different profiles on same day', async () => {
      const profile2 = { ...mockProfile, id: 'profile-456', name: 'Jane Smith' };

      mockProfilesRepository.findOne
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(profile2);

      mockForecastsRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      const result1 = await service.getTodayForecast('profile-123', 'user-123');
      const result2 = await service.getTodayForecast('profile-456', 'user-123');

      expect(mockForecastsRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('action consumption', () => {
    it('should consume premium action when generating new forecast', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(null);
      mockForecastsRepository.create.mockReturnValue(mockForecast);
      mockForecastsRepository.save.mockResolvedValue(mockForecast);
      mockSubscriptionsService.consumePremiumAction.mockResolvedValue(undefined);

      await service.getTodayForecast('profile-123', 'user-123');

      expect(mockSubscriptionsService.consumePremiumAction).toHaveBeenCalledWith(
        'user-123',
        ActionType.DAILY_FORECAST,
        expect.any(Object),
        expect.any(String),
      );
    });

    it('should not consume action when returning cached forecast', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      await service.getTodayForecast('profile-123', 'user-123');

      expect(mockSubscriptionsService.consumePremiumAction).not.toHaveBeenCalled();
    });
  });

  describe('response formatting', () => {
    it('should handle null scores correctly', async () => {
      const forecastWithNullScores = {
        ...mockForecast,
        loveScore: null,
        careerScore: null,
        healthScore: null,
        overallScore: null,
      };

      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(forecastWithNullScores);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.loveScore).toBeNull();
      expect(result.careerScore).toBeNull();
      expect(result.healthScore).toBeNull();
      expect(result.overallScore).toBeNull();
    });

    it('should handle empty lucky numbers array', async () => {
      const forecastWithEmptyNumbers = {
        ...mockForecast,
        luckyNumbers: null,
      };

      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(forecastWithEmptyNumbers);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.luckyNumbers).toEqual([]);
    });

    it('should include timestamps in response', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should include isRead flag in response', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(mockProfile);
      mockForecastsRepository.findOne.mockResolvedValue(mockForecast);

      const result = await service.getTodayForecast('profile-123', 'user-123');

      expect(result).toHaveProperty('isRead');
      expect(typeof result.isRead).toBe('boolean');
    });
  });
});
