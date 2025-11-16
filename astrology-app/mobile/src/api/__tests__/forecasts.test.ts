import { forecastsApi, DailyForecastResponse } from '../forecasts';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('forecastsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDailyForecast: DailyForecastResponse = {
    id: 'forecast_123',
    profileId: 'profile_456',
    date: '2024-11-16',
    sunSign: 'Aries',
    generalForecast: 'Today brings exciting opportunities for personal growth and new beginnings.',
    loveForecast: 'Romance is in the air. Open your heart to new connections.',
    careerForecast: 'Your innovative ideas will be recognized. Speak up in meetings.',
    healthForecast: 'High energy day. Great time for physical activities.',
    luckyNumbers: ['7', '14', '23'],
    luckyColor: 'Red',
    luckyGem: 'Ruby',
    loveScore: 85,
    careerScore: 78,
    healthScore: 92,
    overallScore: 85,
    planetaryTransits: {
      mars: {
        planet: 'Mars',
        theme: 'Energy and Action',
        guidance: 'Channel your energy into productive pursuits.',
      },
    },
  };

  describe('getToday', () => {
    it('should fetch today\'s forecast for a profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(apiClient.get).toHaveBeenCalledWith('/forecasts/today/profile_456');
      expect(result).toEqual(mockDailyForecast);
      expect(result.sunSign).toBe('Aries');
    });

    it('should include all forecast categories', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.generalForecast).toBeDefined();
      expect(result.loveForecast).toBeDefined();
      expect(result.careerForecast).toBeDefined();
      expect(result.healthForecast).toBeDefined();
    });

    it('should include luck elements', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.luckyNumbers).toEqual(['7', '14', '23']);
      expect(result.luckyColor).toBe('Red');
      expect(result.luckyGem).toBe('Ruby');
    });

    it('should include scores for all areas', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.loveScore).toBe(85);
      expect(result.careerScore).toBe(78);
      expect(result.healthScore).toBe(92);
      expect(result.overallScore).toBe(85);
    });

    it('should handle high overall score day', async () => {
      const highScoreForecast: DailyForecastResponse = {
        ...mockDailyForecast,
        overallScore: 95,
        loveScore: 98,
        careerScore: 92,
        healthScore: 95,
        generalForecast: 'Exceptional day ahead! The stars are aligned in your favor.',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: highScoreForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.overallScore).toBeGreaterThanOrEqual(90);
      expect(result.generalForecast).toContain('Exceptional');
    });

    it('should handle low overall score day', async () => {
      const lowScoreForecast: DailyForecastResponse = {
        ...mockDailyForecast,
        overallScore: 35,
        loveScore: 30,
        careerScore: 40,
        healthScore: 35,
        generalForecast: 'Take it easy today. Focus on rest and reflection.',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: lowScoreForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.overallScore).toBeLessThan(50);
    });

    it('should include planetary transits information', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.planetaryTransits).toBeDefined();
      expect(result.planetaryTransits?.mars).toBeDefined();
      expect(result.planetaryTransits?.mars.planet).toBe('Mars');
      expect(result.planetaryTransits?.mars.theme).toBeDefined();
      expect(result.planetaryTransits?.mars.guidance).toBeDefined();
    });

    it('should handle multiple planetary transits', async () => {
      const multiTransitForecast: DailyForecastResponse = {
        ...mockDailyForecast,
        planetaryTransits: {
          mars: {
            planet: 'Mars',
            theme: 'Energy',
            guidance: 'Channel energy wisely.',
          },
          venus: {
            planet: 'Venus',
            theme: 'Love & Beauty',
            guidance: 'Express your creative side.',
          },
          mercury: {
            planet: 'Mercury',
            theme: 'Communication',
            guidance: 'Clear communication is key today.',
          },
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: multiTransitForecast });

      const result = await forecastsApi.getToday('profile_456');

      const transits = Object.keys(result.planetaryTransits || {});
      expect(transits.length).toBe(3);
      expect(transits).toContain('mars');
      expect(transits).toContain('venus');
      expect(transits).toContain('mercury');
    });

    it('should handle forecasts for different zodiac signs', async () => {
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo'];

      for (const sign of signs) {
        const signForecast: DailyForecastResponse = {
          ...mockDailyForecast,
          sunSign: sign,
          generalForecast: `Today's forecast for ${sign}...`,
        };

        (apiClient.get as jest.Mock).mockResolvedValue({ data: signForecast });

        const result = await forecastsApi.getToday('profile_456');

        expect(result.sunSign).toBe(sign);
      }
    });

    it('should handle optional fields being null', async () => {
      const minimalForecast: DailyForecastResponse = {
        id: 'forecast_789',
        profileId: 'profile_456',
        date: '2024-11-16',
        sunSign: 'Pisces',
        generalForecast: 'A peaceful day awaits.',
        loveScore: null,
        careerScore: null,
        healthScore: null,
        overallScore: null,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: minimalForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.loveScore).toBeNull();
      expect(result.careerScore).toBeNull();
      expect(result.healthScore).toBeNull();
      expect(result.overallScore).toBeNull();
      expect(result.loveForecast).toBeUndefined();
      expect(result.careerForecast).toBeUndefined();
    });

    it('should handle errors when fetching forecast', async () => {
      const mockError = new Error('Profile not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(forecastsApi.getToday('invalid_id')).rejects.toThrow('Profile not found');
    });

    it('should include correct date format', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      // Date should be in YYYY-MM-DD format
      expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should validate score ranges (0-100)', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      if (result.loveScore !== null) {
        expect(result.loveScore).toBeGreaterThanOrEqual(0);
        expect(result.loveScore).toBeLessThanOrEqual(100);
      }

      if (result.careerScore !== null) {
        expect(result.careerScore).toBeGreaterThanOrEqual(0);
        expect(result.careerScore).toBeLessThanOrEqual(100);
      }

      if (result.healthScore !== null) {
        expect(result.healthScore).toBeGreaterThanOrEqual(0);
        expect(result.healthScore).toBeLessThanOrEqual(100);
      }

      if (result.overallScore !== null) {
        expect(result.overallScore).toBeGreaterThanOrEqual(0);
        expect(result.overallScore).toBeLessThanOrEqual(100);
      }
    });

    it('should include lucky numbers array', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(Array.isArray(result.luckyNumbers)).toBe(true);
      if (result.luckyNumbers) {
        expect(result.luckyNumbers.length).toBeGreaterThan(0);
      }
    });

    it('should handle forecast with no planetary transits', async () => {
      const noTransitsForecast: DailyForecastResponse = {
        ...mockDailyForecast,
        planetaryTransits: undefined,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: noTransitsForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.planetaryTransits).toBeUndefined();
    });
  });

  describe('Forecast Content Quality', () => {
    it('should provide detailed general forecast', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      expect(result.generalForecast).toBeDefined();
      expect(result.generalForecast.length).toBeGreaterThan(20);
    });

    it('should provide actionable career guidance', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      if (result.careerForecast) {
        expect(result.careerForecast.length).toBeGreaterThan(10);
      }
    });

    it('should provide meaningful love insights', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecast });

      const result = await forecastsApi.getToday('profile_456');

      if (result.loveForecast) {
        expect(result.loveForecast.length).toBeGreaterThan(10);
      }
    });
  });
});
