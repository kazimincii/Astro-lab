import { todayApi, TodaySummary } from '../today';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('todayApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTodaySummary: TodaySummary = {
    profile: {
      id: 'profile_123',
      name: 'John Doe',
      sunSign: 'Aries',
    },
    date: '2024-11-16',
    forecast: {
      general:
        'Today brings exciting opportunities for personal growth and new beginnings.',
      love: 'Romance is in the air. Open your heart to new connections.',
      career: 'Your innovative ideas will be recognized. Speak up in meetings.',
      health: 'High energy day. Great time for physical activities.',
      scores: {
        overall: 85,
        love: 88,
        career: 78,
        health: 92,
      },
      luckyNumbers: ['7', '14', '23'],
      luckyColor: 'Red',
      luckyGem: 'Ruby',
    },
    starMessage: {
      message: 'The universe supports your bold moves today.',
      theme: 'Courage & Initiative',
      keywords: ['Action', 'Confidence', 'New Beginnings'],
    },
    moon: {
      phase: 'Waxing Gibbous',
      sign: 'Leo',
      illumination: 78,
    },
    keyTransit: {
      title: 'Mars in Aries',
      description: 'Powerful energy for taking action and asserting yourself.',
      type: 'planetary',
    },
    calendars: {
      beauty: {
        rating: 85,
        tip: 'Perfect day for a new hairstyle or trying bold makeup.',
      },
      health: {
        rating: 90,
        tip: 'Excellent day for starting a new fitness routine.',
      },
      activity: {
        rating: 92,
        tip: 'High energy makes this ideal for important meetings.',
      },
      spiritual: {
        rating: 75,
        tip: 'Morning meditation will set a positive tone.',
      },
    },
    upcomingEvents: [
      {
        title: 'Full Moon in Gemini',
        date: '2024-11-27',
        type: 'lunar',
      },
      {
        title: 'Mercury Retrograde',
        date: '2024-12-05',
        type: 'planetary',
      },
    ],
  };

  describe('getTodaySummary', () => {
    it('should fetch today\'s summary for a specific profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(apiClient.get).toHaveBeenCalledWith('/today', {
        params: { profileId: 'profile_123' },
      });
      expect(result).toEqual(mockTodaySummary);
    });

    it('should fetch today\'s summary without profile ID', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(apiClient.get).toHaveBeenCalledWith('/today', { params: {} });
      expect(result).toEqual(mockTodaySummary);
    });

    it('should include profile information', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.profile).toBeDefined();
      expect(result.profile.id).toBe('profile_123');
      expect(result.profile.name).toBe('John Doe');
      expect(result.profile.sunSign).toBe('Aries');
    });

    it('should include comprehensive forecast', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.forecast).toBeDefined();
      expect(result.forecast.general).toBeDefined();
      expect(result.forecast.love).toBeDefined();
      expect(result.forecast.career).toBeDefined();
      expect(result.forecast.health).toBeDefined();
    });

    it('should include all forecast scores', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.forecast.scores.overall).toBe(85);
      expect(result.forecast.scores.love).toBe(88);
      expect(result.forecast.scores.career).toBe(78);
      expect(result.forecast.scores.health).toBe(92);
    });

    it('should include luck elements', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.forecast.luckyNumbers).toEqual(['7', '14', '23']);
      expect(result.forecast.luckyColor).toBe('Red');
      expect(result.forecast.luckyGem).toBe('Ruby');
    });

    it('should include star message', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.starMessage).toBeDefined();
      expect(result.starMessage.message).toBeDefined();
      expect(result.starMessage.theme).toBe('Courage & Initiative');
      expect(Array.isArray(result.starMessage.keywords)).toBe(true);
    });

    it('should include moon information', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.moon).toBeDefined();
      expect(result.moon.phase).toBe('Waxing Gibbous');
      expect(result.moon.sign).toBe('Leo');
      expect(result.moon.illumination).toBe(78);
    });

    it('should include key planetary transit', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.keyTransit).toBeDefined();
      expect(result.keyTransit?.title).toBe('Mars in Aries');
      expect(result.keyTransit?.description).toBeDefined();
      expect(result.keyTransit?.type).toBe('planetary');
    });

    it('should include all calendar ratings', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.calendars.beauty.rating).toBe(85);
      expect(result.calendars.health.rating).toBe(90);
      expect(result.calendars.activity.rating).toBe(92);
      expect(result.calendars.spiritual.rating).toBe(75);
    });

    it('should include calendar tips', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.calendars.beauty.tip).toBeDefined();
      expect(result.calendars.health.tip).toBeDefined();
      expect(result.calendars.activity.tip).toBeDefined();
      expect(result.calendars.spiritual.tip).toBeDefined();
    });

    it('should include upcoming events', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(Array.isArray(result.upcomingEvents)).toBe(true);
      expect(result.upcomingEvents.length).toBeGreaterThan(0);
    });

    it('should handle high energy day', async () => {
      const highEnergyDay: TodaySummary = {
        ...mockTodaySummary,
        forecast: {
          ...mockTodaySummary.forecast,
          scores: { overall: 95, love: 92, career: 98, health: 95 },
        },
        calendars: {
          beauty: { rating: 95, tip: 'Excellent day for bold changes.' },
          health: { rating: 98, tip: 'Peak energy for intense workouts.' },
          activity: { rating: 99, tip: 'Tackle your most challenging tasks.' },
          spiritual: { rating: 90, tip: 'Deep meditation brings insights.' },
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: highEnergyDay });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.forecast.scores.overall).toBeGreaterThanOrEqual(90);
      expect(result.calendars.activity.rating).toBeGreaterThanOrEqual(90);
    });

    it('should handle low energy day', async () => {
      const lowEnergyDay: TodaySummary = {
        ...mockTodaySummary,
        forecast: {
          ...mockTodaySummary.forecast,
          scores: { overall: 35, love: 40, career: 30, health: 35 },
          general: 'Take it easy today. Focus on rest and reflection.',
        },
        calendars: {
          beauty: { rating: 40, tip: 'Keep it simple today.' },
          health: { rating: 30, tip: 'Rest and recovery are priorities.' },
          activity: { rating: 35, tip: 'Postpone major decisions if possible.' },
          spiritual: { rating: 70, tip: 'Perfect day for inner work.' },
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: lowEnergyDay });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.forecast.scores.overall).toBeLessThan(50);
    });

    it('should handle null key transit', async () => {
      const noTransitSummary: TodaySummary = {
        ...mockTodaySummary,
        keyTransit: null,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: noTransitSummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.keyTransit).toBeNull();
    });

    it('should handle errors when fetching summary', async () => {
      const mockError = new Error('Profile not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(todayApi.getTodaySummary('invalid_id')).rejects.toThrow(
        'Profile not found'
      );
    });
  });

  describe('Moon Phases', () => {
    it('should handle different moon phases', async () => {
      const phases = [
        'New Moon',
        'Waxing Crescent',
        'First Quarter',
        'Waxing Gibbous',
        'Full Moon',
        'Waning Gibbous',
        'Last Quarter',
        'Waning Crescent',
      ];

      for (const phase of phases) {
        const phaseSummary: TodaySummary = {
          ...mockTodaySummary,
          moon: { ...mockTodaySummary.moon, phase },
        };

        (apiClient.get as jest.Mock).mockResolvedValue({ data: phaseSummary });

        const result = await todayApi.getTodaySummary('profile_123');

        expect(result.moon.phase).toBe(phase);
      }
    });

    it('should have moon illumination between 0 and 100', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.moon.illumination).toBeGreaterThanOrEqual(0);
      expect(result.moon.illumination).toBeLessThanOrEqual(100);
    });

    it('should include moon zodiac sign', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.moon.sign).toBeDefined();
      expect(typeof result.moon.sign).toBe('string');
    });
  });

  describe('Upcoming Events', () => {
    it('should include event details', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      result.upcomingEvents.forEach((event) => {
        expect(event.title).toBeDefined();
        expect(event.date).toBeDefined();
        expect(event.type).toBeDefined();
      });
    });

    it('should have events in chronological order', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      if (result.upcomingEvents.length > 1) {
        const dates = result.upcomingEvents.map((e) => new Date(e.date));
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i - 1].getTime());
        }
      }
    });

    it('should include different event types', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      const types = result.upcomingEvents.map((e) => e.type);
      expect(types).toContain('lunar');
      expect(types).toContain('planetary');
    });
  });

  describe('Score Validation', () => {
    it('should have all scores between 0 and 100', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.forecast.scores.overall).toBeGreaterThanOrEqual(0);
      expect(result.forecast.scores.overall).toBeLessThanOrEqual(100);
      expect(result.forecast.scores.love).toBeGreaterThanOrEqual(0);
      expect(result.forecast.scores.love).toBeLessThanOrEqual(100);
      expect(result.forecast.scores.career).toBeGreaterThanOrEqual(0);
      expect(result.forecast.scores.career).toBeLessThanOrEqual(100);
      expect(result.forecast.scores.health).toBeGreaterThanOrEqual(0);
      expect(result.forecast.scores.health).toBeLessThanOrEqual(100);
    });

    it('should have calendar ratings between 0 and 100', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.calendars.beauty.rating).toBeGreaterThanOrEqual(0);
      expect(result.calendars.beauty.rating).toBeLessThanOrEqual(100);
      expect(result.calendars.health.rating).toBeGreaterThanOrEqual(0);
      expect(result.calendars.health.rating).toBeLessThanOrEqual(100);
      expect(result.calendars.activity.rating).toBeGreaterThanOrEqual(0);
      expect(result.calendars.activity.rating).toBeLessThanOrEqual(100);
      expect(result.calendars.spiritual.rating).toBeGreaterThanOrEqual(0);
      expect(result.calendars.spiritual.rating).toBeLessThanOrEqual(100);
    });
  });

  describe('Date Format', () => {
    it('should have date in YYYY-MM-DD format', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should have upcoming events in correct date format', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      result.upcomingEvents.forEach((event) => {
        expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe('Content Quality', () => {
    it('should provide meaningful forecast messages', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.forecast.general.length).toBeGreaterThan(20);
      expect(result.forecast.love.length).toBeGreaterThan(10);
      expect(result.forecast.career.length).toBeGreaterThan(10);
      expect(result.forecast.health.length).toBeGreaterThan(10);
    });

    it('should provide actionable calendar tips', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.calendars.beauty.tip.length).toBeGreaterThan(10);
      expect(result.calendars.health.tip.length).toBeGreaterThan(10);
      expect(result.calendars.activity.tip.length).toBeGreaterThan(10);
      expect(result.calendars.spiritual.tip.length).toBeGreaterThan(10);
    });

    it('should include relevant keywords in star message', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile_123');

      expect(result.starMessage.keywords.length).toBeGreaterThan(0);
      result.starMessage.keywords.forEach((keyword) => {
        expect(typeof keyword).toBe('string');
        expect(keyword.length).toBeGreaterThan(0);
      });
    });
  });
});
