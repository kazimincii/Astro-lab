import { forecastsApi, DailyForecastResponse } from '../forecasts';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('forecastsApi', () => {
  const mockForecast: DailyForecastResponse = {
    id: 'forecast-123',
    profileId: 'profile-456',
    date: '2024-01-15',
    sunSign: 'Aries',
    generalForecast: 'Today brings opportunities for new beginnings and fresh starts.',
    loveForecast: 'Your relationships benefit from open and honest communication.',
    careerForecast: 'Professional recognition is on the horizon. Take initiative.',
    healthForecast: 'Focus on balance between activity and rest.',
    luckyNumbers: ['7', '14', '21', '33'],
    luckyColor: '#FF5733',
    luckyGem: 'Ruby',
    loveScore: 7.5,
    careerScore: 8.5,
    healthScore: 6.5,
    overallScore: 7.5,
    planetaryTransits: {
      mars: {
        planet: 'Mars',
        theme: 'Energy and Action',
        guidance: 'Channel your energy into productive pursuits.',
      },
      venus: {
        planet: 'Venus',
        theme: 'Love and Harmony',
        guidance: 'Focus on building meaningful connections.',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getToday', () => {
    it('should get today\'s forecast for profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(apiClient.get).toHaveBeenCalledWith('/forecasts/today/profile-456');
      expect(result).toEqual(mockForecast);
    });

    it('should return forecast with all required fields', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('profileId');
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('sunSign');
      expect(result).toHaveProperty('generalForecast');
    });

    it('should return sun sign', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.sunSign).toBe('Aries');
    });

    it('should return general forecast text', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.generalForecast).toBeDefined();
      expect(typeof result.generalForecast).toBe('string');
      expect(result.generalForecast.length).toBeGreaterThan(0);
    });

    it('should return love forecast', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.loveForecast).toBeDefined();
      expect(typeof result.loveForecast).toBe('string');
    });

    it('should return career forecast', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.careerForecast).toBeDefined();
      expect(typeof result.careerForecast).toBe('string');
    });

    it('should return health forecast', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.healthForecast).toBeDefined();
      expect(typeof result.healthForecast).toBe('string');
    });

    it('should return lucky numbers array', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(Array.isArray(result.luckyNumbers)).toBe(true);
      expect(result.luckyNumbers).toEqual(['7', '14', '21', '33']);
    });

    it('should return lucky color', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.luckyColor).toBe('#FF5733');
    });

    it('should return lucky gem', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.luckyGem).toBe('Ruby');
    });

    it('should return love score as number', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(typeof result.loveScore).toBe('number');
      expect(result.loveScore).toBe(7.5);
    });

    it('should return career score as number', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(typeof result.careerScore).toBe('number');
      expect(result.careerScore).toBe(8.5);
    });

    it('should return health score as number', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(typeof result.healthScore).toBe('number');
      expect(result.healthScore).toBe(6.5);
    });

    it('should return overall score as number', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(typeof result.overallScore).toBe('number');
      expect(result.overallScore).toBe(7.5);
    });

    it('should return planetary transits', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.planetaryTransits).toBeDefined();
      expect(typeof result.planetaryTransits).toBe('object');
    });

    it('should include transit details for each planet', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.planetaryTransits?.mars).toBeDefined();
      expect(result.planetaryTransits?.mars.planet).toBe('Mars');
      expect(result.planetaryTransits?.mars.theme).toBe('Energy and Action');
      expect(result.planetaryTransits?.mars.guidance).toBeDefined();
    });

    it('should handle optional fields as undefined', async () => {
      const minimalForecast: DailyForecastResponse = {
        id: 'forecast-min',
        profileId: 'profile-456',
        date: '2024-01-15',
        sunSign: 'Taurus',
        generalForecast: 'Basic forecast',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: minimalForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.loveForecast).toBeUndefined();
      expect(result.careerForecast).toBeUndefined();
      expect(result.healthForecast).toBeUndefined();
      expect(result.luckyNumbers).toBeUndefined();
    });

    it('should handle null scores', async () => {
      const forecastWithNullScores: DailyForecastResponse = {
        ...mockForecast,
        loveScore: null,
        careerScore: null,
        healthScore: null,
        overallScore: null,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: forecastWithNullScores });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.loveScore).toBeNull();
      expect(result.careerScore).toBeNull();
      expect(result.healthScore).toBeNull();
      expect(result.overallScore).toBeNull();
    });

    it('should handle different sun signs', async () => {
      const sunSigns = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
      ];

      for (const sunSign of sunSigns) {
        const forecast = { ...mockForecast, sunSign };
        (apiClient.get as jest.Mock).mockResolvedValue({ data: forecast });

        const result = await forecastsApi.getToday('profile-456');

        expect(result.sunSign).toBe(sunSign);
      }
    });

    it('should handle different profile IDs', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      await forecastsApi.getToday('profile-123');
      expect(apiClient.get).toHaveBeenCalledWith('/forecasts/today/profile-123');

      await forecastsApi.getToday('profile-789');
      expect(apiClient.get).toHaveBeenCalledWith('/forecasts/today/profile-789');
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch forecast');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(forecastsApi.getToday('profile-456')).rejects.toThrow(
        'Failed to fetch forecast',
      );
    });

    it('should handle 404 when profile not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Profile not found' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(forecastsApi.getToday('non-existent')).rejects.toEqual(mockError);
    });

    it('should handle 401 unauthorized errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(forecastsApi.getToday('profile-456')).rejects.toEqual(mockError);
    });

    it('should handle network timeout errors', async () => {
      const mockError = new Error('Network timeout');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(forecastsApi.getToday('profile-456')).rejects.toThrow(
        'Network timeout',
      );
    });

    it('should call API only once per request', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      await forecastsApi.getToday('profile-456');

      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });

    it('should return ISO date string', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockForecast });

      const result = await forecastsApi.getToday('profile-456');

      expect(result.date).toBe('2024-01-15');
      expect(typeof result.date).toBe('string');
    });

    it('should handle multiple planetary transits', async () => {
      const forecastWithMultipleTransits: DailyForecastResponse = {
        ...mockForecast,
        planetaryTransits: {
          mars: {
            planet: 'Mars',
            theme: 'Energy',
            guidance: 'Be active',
          },
          venus: {
            planet: 'Venus',
            theme: 'Love',
            guidance: 'Open your heart',
          },
          mercury: {
            planet: 'Mercury',
            theme: 'Communication',
            guidance: 'Speak clearly',
          },
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: forecastWithMultipleTransits });

      const result = await forecastsApi.getToday('profile-456');

      expect(Object.keys(result.planetaryTransits || {}).length).toBe(3);
      expect(result.planetaryTransits?.mercury).toBeDefined();
    });
  });
});
