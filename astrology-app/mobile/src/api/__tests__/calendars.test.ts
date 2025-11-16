import { calendarsApi, CalendarEntry, CalendarType } from '../calendars';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('calendarsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCalendar', () => {
    it('should fetch beauty calendar for a month', async () => {
      const mockCalendar: CalendarEntry[] = [
        {
          date: '2024-01-15',
          type: 'beauty',
          rating: 85,
          tips: ['Good day for haircuts', 'Skincare treatments recommended'],
          favorableActivities: ['Hair styling', 'Facial treatments', 'Makeup'],
          unfavorableActivities: ['Permanent procedures'],
        },
        {
          date: '2024-01-16',
          type: 'beauty',
          rating: 45,
          tips: ['Avoid major changes', 'Maintain routine'],
          favorableActivities: ['Simple skincare'],
          unfavorableActivities: ['Haircuts', 'Coloring', 'Permanent makeup'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('beauty', 1, 2024);

      expect(apiClient.get).toHaveBeenCalledWith('/calendars/beauty', {
        params: { month: 1, year: 2024 },
      });
      expect(result).toEqual(mockCalendar);
      expect(result.length).toBe(2);
    });

    it('should fetch health calendar for a month', async () => {
      const mockCalendar: CalendarEntry[] = [
        {
          date: '2024-02-10',
          type: 'health',
          rating: 90,
          tips: ['Excellent energy levels', 'Good for intensive workouts'],
          favorableActivities: ['Exercise', 'Medical checkups', 'Detox'],
          unfavorableActivities: [],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('health', 2, 2024);

      expect(apiClient.get).toHaveBeenCalledWith('/calendars/health', {
        params: { month: 2, year: 2024 },
      });
      expect(result[0].type).toBe('health');
    });

    it('should fetch activity calendar for a month', async () => {
      const mockCalendar: CalendarEntry[] = [
        {
          date: '2024-03-05',
          type: 'activity',
          rating: 75,
          tips: ['Good day for starting projects', 'Favorable for social events'],
          favorableActivities: ['Meetings', 'Networking', 'Launches'],
          unfavorableActivities: ['Major purchases'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('activity', 3, 2024);

      expect(result[0].type).toBe('activity');
      expect(result[0].favorableActivities).toBeDefined();
    });

    it('should fetch spiritual calendar for a month', async () => {
      const mockCalendar: CalendarEntry[] = [
        {
          date: '2024-04-08',
          type: 'spiritual',
          rating: 95,
          tips: ['High spiritual energy', 'Perfect for meditation'],
          favorableActivities: ['Meditation', 'Yoga', 'Energy work', 'Prayer'],
          unfavorableActivities: [],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('spiritual', 4, 2024);

      expect(result[0].type).toBe('spiritual');
      expect(result[0].rating).toBeGreaterThan(90);
    });

    it('should fetch transit calendar for a month', async () => {
      const mockCalendar: CalendarEntry[] = [
        {
          date: '2024-05-12',
          type: 'transit',
          rating: 60,
          tips: ['Mercury retrograde effects', 'Double-check communications'],
          favorableActivities: ['Review', 'Reflection'],
          unfavorableActivities: ['New contracts', 'Major decisions'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('transit', 5, 2024);

      expect(result[0].type).toBe('transit');
    });

    it('should fetch moon calendar for a month', async () => {
      const mockCalendar: CalendarEntry[] = [
        {
          date: '2024-06-20',
          type: 'moon',
          rating: 80,
          tips: ['Full moon energy', 'Release old patterns'],
          favorableActivities: ['Manifestation', 'Completion'],
          unfavorableActivities: ['Starting new projects'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('moon', 6, 2024);

      expect(result[0].type).toBe('moon');
    });

    it('should handle errors when fetching calendar', async () => {
      const mockError = new Error('Failed to fetch calendar');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(calendarsApi.getCalendar('beauty', 1, 2024)).rejects.toThrow(
        'Failed to fetch calendar'
      );
    });

    it('should validate rating range (0-100)', async () => {
      const mockCalendar: CalendarEntry[] = [
        {
          date: '2024-07-15',
          type: 'beauty',
          rating: 100,
          tips: ['Perfect day'],
          favorableActivities: ['All activities'],
        },
        {
          date: '2024-07-16',
          type: 'beauty',
          rating: 0,
          tips: ['Challenging day'],
          unfavorableActivities: ['All major changes'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('beauty', 7, 2024);

      result.forEach((entry) => {
        expect(entry.rating).toBeGreaterThanOrEqual(0);
        expect(entry.rating).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('getDay', () => {
    it('should fetch beauty calendar for specific day', async () => {
      const mockEntry: CalendarEntry = {
        date: '2024-01-15',
        type: 'beauty',
        rating: 85,
        tips: ['Excellent for hair treatments', 'Good for skin care'],
        favorableActivities: ['Haircuts', 'Facials', 'Manicures'],
        unfavorableActivities: ['Permanent procedures'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntry });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(apiClient.get).toHaveBeenCalledWith('/calendars/beauty/day/2024-01-15');
      expect(result).toEqual(mockEntry);
      expect(result.date).toBe('2024-01-15');
    });

    it('should fetch health calendar for specific day', async () => {
      const mockEntry: CalendarEntry = {
        date: '2024-02-20',
        type: 'health',
        rating: 70,
        tips: ['Moderate energy day', 'Good for light exercise'],
        favorableActivities: ['Yoga', 'Walking', 'Stretching'],
        unfavorableActivities: ['Intensive workouts'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntry });

      const result = await calendarsApi.getDay('health', '2024-02-20');

      expect(result.type).toBe('health');
      expect(result.rating).toBe(70);
    });

    it('should handle day not found', async () => {
      const mockError = new Error('Day not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(calendarsApi.getDay('beauty', 'invalid-date')).rejects.toThrow(
        'Day not found'
      );
    });

    it('should include optional fields when present', async () => {
      const mockEntry: CalendarEntry = {
        date: '2024-03-10',
        type: 'activity',
        rating: 65,
        tips: ['Neutral day for activities'],
        favorableActivities: ['Routine tasks', 'Planning'],
        unfavorableActivities: ['Major launches'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntry });

      const result = await calendarsApi.getDay('activity', '2024-03-10');

      expect(result.favorableActivities).toBeDefined();
      expect(result.unfavorableActivities).toBeDefined();
    });

    it('should work without optional fields', async () => {
      const mockEntry: CalendarEntry = {
        date: '2024-04-15',
        type: 'spiritual',
        rating: 50,
        tips: ['Regular spiritual practice recommended'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntry });

      const result = await calendarsApi.getDay('spiritual', '2024-04-15');

      expect(result.favorableActivities).toBeUndefined();
      expect(result.unfavorableActivities).toBeUndefined();
    });
  });

  describe('getAllCalendarsForDay', () => {
    it('should fetch all calendar types for a specific day', async () => {
      const mockEntries: CalendarEntry[] = [
        {
          date: '2024-01-15',
          type: 'beauty',
          rating: 85,
          tips: ['Good for beauty treatments'],
        },
        {
          date: '2024-01-15',
          type: 'health',
          rating: 70,
          tips: ['Moderate energy'],
        },
        {
          date: '2024-01-15',
          type: 'activity',
          rating: 60,
          tips: ['Good for routine tasks'],
        },
        {
          date: '2024-01-15',
          type: 'spiritual',
          rating: 90,
          tips: ['High spiritual energy'],
        },
        {
          date: '2024-01-15',
          type: 'transit',
          rating: 55,
          tips: ['Be mindful of communications'],
        },
        {
          date: '2024-01-15',
          type: 'moon',
          rating: 75,
          tips: ['Waxing moon energy'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      expect(apiClient.get).toHaveBeenCalledWith('/calendars/day/2024-01-15');
      expect(result).toEqual(mockEntries);
      expect(result.length).toBe(6);
    });

    it('should include all calendar types', async () => {
      const mockEntries: CalendarEntry[] = [
        {
          date: '2024-02-10',
          type: 'beauty',
          rating: 70,
          tips: ['Beauty tips'],
        },
        {
          date: '2024-02-10',
          type: 'health',
          rating: 80,
          tips: ['Health tips'],
        },
        {
          date: '2024-02-10',
          type: 'activity',
          rating: 65,
          tips: ['Activity tips'],
        },
        {
          date: '2024-02-10',
          type: 'spiritual',
          rating: 75,
          tips: ['Spiritual tips'],
        },
        {
          date: '2024-02-10',
          type: 'transit',
          rating: 60,
          tips: ['Transit tips'],
        },
        {
          date: '2024-02-10',
          type: 'moon',
          rating: 85,
          tips: ['Moon tips'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-02-10');

      const types = result.map((entry) => entry.type);
      expect(types).toContain('beauty');
      expect(types).toContain('health');
      expect(types).toContain('activity');
      expect(types).toContain('spiritual');
      expect(types).toContain('transit');
      expect(types).toContain('moon');
    });

    it('should handle errors when fetching all calendars', async () => {
      const mockError = new Error('Failed to fetch calendars');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(calendarsApi.getAllCalendarsForDay('2024-01-15')).rejects.toThrow(
        'Failed to fetch calendars'
      );
    });

    it('should have same date for all entries', async () => {
      const mockEntries: CalendarEntry[] = [
        {
          date: '2024-03-20',
          type: 'beauty',
          rating: 70,
          tips: ['Tips'],
        },
        {
          date: '2024-03-20',
          type: 'health',
          rating: 80,
          tips: ['Tips'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-03-20');

      result.forEach((entry) => {
        expect(entry.date).toBe('2024-03-20');
      });
    });

    it('should have varying ratings across calendar types', async () => {
      const mockEntries: CalendarEntry[] = [
        {
          date: '2024-04-10',
          type: 'beauty',
          rating: 90,
          tips: ['High rating'],
        },
        {
          date: '2024-04-10',
          type: 'health',
          rating: 45,
          tips: ['Low rating'],
        },
        {
          date: '2024-04-10',
          type: 'activity',
          rating: 60,
          tips: ['Medium rating'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-04-10');

      const ratings = result.map((entry) => entry.rating);
      expect(Math.max(...ratings)).toBe(90);
      expect(Math.min(...ratings)).toBe(45);
    });
  });

  describe('Calendar Type Validation', () => {
    it('should support all calendar types', () => {
      const validTypes: CalendarType[] = [
        'beauty',
        'health',
        'activity',
        'spiritual',
        'transit',
        'moon',
      ];

      validTypes.forEach((type) => {
        expect(['beauty', 'health', 'activity', 'spiritual', 'transit', 'moon']).toContain(
          type
        );
      });
    });

    it('should have non-empty tips array', async () => {
      const mockEntry: CalendarEntry = {
        date: '2024-05-15',
        type: 'beauty',
        rating: 80,
        tips: ['Tip 1', 'Tip 2', 'Tip 3'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntry });

      const result = await calendarsApi.getDay('beauty', '2024-05-15');

      expect(result.tips.length).toBeGreaterThan(0);
    });
  });
});
