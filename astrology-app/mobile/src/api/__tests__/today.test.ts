import { todayApi, TodaySummary } from '../today';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('todayApi', () => {
  const mockTodaySummary: TodaySummary = {
    profile: {
      id: 'profile-123',
      name: 'John Doe',
      sunSign: 'Aries',
    },
    date: '2024-01-15',
    forecast: {
      general: 'Today brings opportunities for growth and new beginnings.',
      love: 'Your relationships will flourish with open communication.',
      career: 'Success awaits those who take initiative at work.',
      health: 'Focus on balance between activity and rest.',
      scores: {
        overall: 8.5,
        love: 7.5,
        career: 9.0,
        health: 7.0,
      },
      luckyNumbers: ['7', '14', '21', '33'],
      luckyColor: '#FF5733',
      luckyGem: 'Ruby',
    },
    starMessage: {
      message: 'The stars align in your favor today.',
      theme: 'New Beginnings',
      keywords: ['courage', 'action', 'opportunity'],
    },
    moon: {
      phase: 'Waxing Crescent',
      sign: 'Taurus',
      illumination: 25.5,
    },
    keyTransit: {
      title: 'Mars in Aries',
      description: 'Energy and drive are heightened.',
      type: 'planetary',
    },
    calendars: {
      beauty: {
        rating: 8,
        tip: 'Great day for self-care rituals',
      },
      health: {
        rating: 7,
        tip: 'Focus on hydration and rest',
      },
      activity: {
        rating: 9,
        tip: 'Perfect for starting new projects',
      },
      spiritual: {
        rating: 8,
        tip: 'Meditation will bring clarity',
      },
    },
    upcomingEvents: [
      {
        title: 'Full Moon in Leo',
        date: '2024-01-25',
        type: 'lunar',
      },
      {
        title: 'Mercury Retrograde',
        date: '2024-02-01',
        type: 'planetary',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodaySummary', () => {
    it('should fetch today summary without profile ID', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(apiClient.get).toHaveBeenCalledWith('/today', { params: {} });
      expect(result).toEqual(mockTodaySummary);
    });

    it('should fetch today summary with profile ID', async () => {
      const profileId = 'profile-456';
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary(profileId);

      expect(apiClient.get).toHaveBeenCalledWith('/today', {
        params: { profileId },
      });
      expect(result).toEqual(mockTodaySummary);
    });

    it('should return complete TodaySummary object structure', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('forecast');
      expect(result).toHaveProperty('starMessage');
      expect(result).toHaveProperty('moon');
      expect(result).toHaveProperty('keyTransit');
      expect(result).toHaveProperty('calendars');
      expect(result).toHaveProperty('upcomingEvents');
    });

    it('should return profile information with all required fields', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('profile-123');

      expect(result.profile).toHaveProperty('id');
      expect(result.profile).toHaveProperty('name');
      expect(result.profile).toHaveProperty('sunSign');
      expect(result.profile.id).toBe('profile-123');
      expect(result.profile.name).toBe('John Doe');
      expect(result.profile.sunSign).toBe('Aries');
    });

    it('should return forecast with all score categories', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(result.forecast.scores).toHaveProperty('overall');
      expect(result.forecast.scores).toHaveProperty('love');
      expect(result.forecast.scores).toHaveProperty('career');
      expect(result.forecast.scores).toHaveProperty('health');
    });

    it('should return forecast with lucky elements', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(result.forecast.luckyNumbers).toEqual(['7', '14', '21', '33']);
      expect(result.forecast.luckyColor).toBe('#FF5733');
      expect(result.forecast.luckyGem).toBe('Ruby');
    });

    it('should return moon phase information', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(result.moon.phase).toBe('Waxing Crescent');
      expect(result.moon.sign).toBe('Taurus');
      expect(result.moon.illumination).toBe(25.5);
    });

    it('should return star message with theme and keywords', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(result.starMessage.message).toBe('The stars align in your favor today.');
      expect(result.starMessage.theme).toBe('New Beginnings');
      expect(result.starMessage.keywords).toEqual(['courage', 'action', 'opportunity']);
    });

    it('should return key transit information when available', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(result.keyTransit).not.toBeNull();
      expect(result.keyTransit?.title).toBe('Mars in Aries');
      expect(result.keyTransit?.description).toBe('Energy and drive are heightened.');
      expect(result.keyTransit?.type).toBe('planetary');
    });

    it('should handle null key transit', async () => {
      const summaryWithoutTransit = {
        ...mockTodaySummary,
        keyTransit: null,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: summaryWithoutTransit });

      const result = await todayApi.getTodaySummary();

      expect(result.keyTransit).toBeNull();
    });

    it('should return all calendar categories', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(result.calendars).toHaveProperty('beauty');
      expect(result.calendars).toHaveProperty('health');
      expect(result.calendars).toHaveProperty('activity');
      expect(result.calendars).toHaveProperty('spiritual');

      expect(result.calendars.beauty.rating).toBe(8);
      expect(result.calendars.beauty.tip).toBe('Great day for self-care rituals');
    });

    it('should return upcoming events array', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      expect(Array.isArray(result.upcomingEvents)).toBe(true);
      expect(result.upcomingEvents).toHaveLength(2);
      expect(result.upcomingEvents[0].title).toBe('Full Moon in Leo');
      expect(result.upcomingEvents[0].date).toBe('2024-01-25');
      expect(result.upcomingEvents[0].type).toBe('lunar');
    });

    it('should handle empty upcoming events array', async () => {
      const summaryWithoutEvents = {
        ...mockTodaySummary,
        upcomingEvents: [],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: summaryWithoutEvents });

      const result = await todayApi.getTodaySummary();

      expect(result.upcomingEvents).toEqual([]);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(todayApi.getTodaySummary()).rejects.toThrow('Network error');
    });

    it('should handle 401 unauthorized errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(todayApi.getTodaySummary()).rejects.toEqual(mockError);
    });

    it('should handle 404 not found errors', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Profile not found' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(todayApi.getTodaySummary('invalid-profile')).rejects.toEqual(mockError);
    });

    it('should handle 500 server errors', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(todayApi.getTodaySummary()).rejects.toEqual(mockError);
    });

    it('should call API only once per request', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      await todayApi.getTodaySummary();

      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple sequential requests', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      await todayApi.getTodaySummary('profile-1');
      await todayApi.getTodaySummary('profile-2');
      await todayApi.getTodaySummary();

      expect(apiClient.get).toHaveBeenCalledTimes(3);
      expect(apiClient.get).toHaveBeenNthCalledWith(1, '/today', {
        params: { profileId: 'profile-1' },
      });
      expect(apiClient.get).toHaveBeenNthCalledWith(2, '/today', {
        params: { profileId: 'profile-2' },
      });
      expect(apiClient.get).toHaveBeenNthCalledWith(3, '/today', {
        params: {},
      });
    });

    it('should preserve all data types correctly', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary();

      // String types
      expect(typeof result.profile.name).toBe('string');
      expect(typeof result.date).toBe('string');
      expect(typeof result.forecast.general).toBe('string');

      // Number types
      expect(typeof result.forecast.scores.overall).toBe('number');
      expect(typeof result.moon.illumination).toBe('number');
      expect(typeof result.calendars.beauty.rating).toBe('number');

      // Array types
      expect(Array.isArray(result.forecast.luckyNumbers)).toBe(true);
      expect(Array.isArray(result.starMessage.keywords)).toBe(true);
      expect(Array.isArray(result.upcomingEvents)).toBe(true);
    });

    it('should handle undefined profile ID parameter', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary(undefined);

      expect(apiClient.get).toHaveBeenCalledWith('/today', { params: {} });
      expect(result).toEqual(mockTodaySummary);
    });

    it('should handle empty string profile ID', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummary });

      const result = await todayApi.getTodaySummary('');

      expect(apiClient.get).toHaveBeenCalledWith('/today', { params: {} });
      expect(result).toEqual(mockTodaySummary);
    });
  });
});
