import { calendarsApi, CalendarType, CalendarEntry } from '../calendars';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('calendarsApi', () => {
  const mockBeautyEntry: CalendarEntry = {
    date: '2024-01-15',
    type: 'beauty',
    rating: 8.5,
    tips: [
      'Excellent day for skincare treatments',
      'Hair treatments will have lasting effects',
      'Try a new makeup look',
    ],
    favorableActivities: ['Facial treatments', 'Hair coloring', 'Manicure/pedicure'],
    unfavorableActivities: ['Permanent makeup', 'Drastic hair changes'],
  };

  const mockHealthEntry: CalendarEntry = {
    date: '2024-01-15',
    type: 'health',
    rating: 7.5,
    tips: [
      'Good day to start a new diet',
      'Focus on cardiovascular exercise',
      'Hydration is key today',
    ],
    favorableActivities: ['Cardio workouts', 'Yoga', 'Swimming'],
    unfavorableActivities: ['Heavy lifting', 'Intense sports'],
  };

  const mockActivityEntry: CalendarEntry = {
    date: '2024-01-15',
    type: 'activity',
    rating: 9.0,
    tips: [
      'High energy day for physical activities',
      'Great for team sports',
      'Outdoor activities favored',
    ],
    favorableActivities: ['Running', 'Team sports', 'Hiking'],
    unfavorableActivities: [],
  };

  const mockSpiritualEntry: CalendarEntry = {
    date: '2024-01-15',
    type: 'spiritual',
    rating: 8.0,
    tips: [
      'Perfect day for meditation',
      'Spiritual practices are amplified',
      'Connect with your higher self',
    ],
    favorableActivities: ['Meditation', 'Prayer', 'Yoga', 'Energy healing'],
    unfavorableActivities: [],
  };

  const mockTransitEntry: CalendarEntry = {
    date: '2024-01-15',
    type: 'transit',
    rating: 6.5,
    tips: [
      'Mercury-Venus alignment brings harmony',
      'Communication flows easily',
      'Good for creative projects',
    ],
    favorableActivities: ['Negotiations', 'Creative work', 'Social events'],
    unfavorableActivities: ['Major decisions', 'Starting new ventures'],
  };

  const mockMoonEntry: CalendarEntry = {
    date: '2024-01-15',
    type: 'moon',
    rating: 7.0,
    tips: [
      'Waxing Gibbous phase',
      'Time for refinement and adjustment',
      'Emotional sensitivity heightened',
    ],
    favorableActivities: ['Planning', 'Reviewing progress', 'Emotional work'],
    unfavorableActivities: ['Starting new projects', 'Impulsive actions'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCalendar', () => {
    it('should get beauty calendar for specific month', async () => {
      const mockCalendar = Array.from({ length: 31 }, (_, i) => ({
        ...mockBeautyEntry,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      }));

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('beauty', 1, 2024);

      expect(apiClient.get).toHaveBeenCalledWith('/calendars/beauty', {
        params: { month: 1, year: 2024 },
      });
      expect(result).toEqual(mockCalendar);
    });

    it('should get health calendar for specific month', async () => {
      const mockCalendar = [mockHealthEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('health', 1, 2024);

      expect(apiClient.get).toHaveBeenCalledWith('/calendars/health', {
        params: { month: 1, year: 2024 },
      });
      expect(result[0].type).toBe('health');
    });

    it('should get activity calendar for specific month', async () => {
      const mockCalendar = [mockActivityEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('activity', 1, 2024);

      expect(result[0].type).toBe('activity');
    });

    it('should get spiritual calendar for specific month', async () => {
      const mockCalendar = [mockSpiritualEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('spiritual', 1, 2024);

      expect(result[0].type).toBe('spiritual');
    });

    it('should get transit calendar for specific month', async () => {
      const mockCalendar = [mockTransitEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('transit', 1, 2024);

      expect(result[0].type).toBe('transit');
    });

    it('should get moon calendar for specific month', async () => {
      const mockCalendar = [mockMoonEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('moon', 1, 2024);

      expect(result[0].type).toBe('moon');
    });

    it('should return array of calendar entries', async () => {
      const mockCalendar = [mockBeautyEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockCalendar });

      const result = await calendarsApi.getCalendar('beauty', 1, 2024);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return entries with all required fields', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockBeautyEntry] });

      const result = await calendarsApi.getCalendar('beauty', 1, 2024);

      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('rating');
      expect(result[0]).toHaveProperty('tips');
    });

    it('should return entries with rating between 0 and 10', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockBeautyEntry] });

      const result = await calendarsApi.getCalendar('beauty', 1, 2024);

      result.forEach((entry) => {
        expect(entry.rating).toBeGreaterThanOrEqual(0);
        expect(entry.rating).toBeLessThanOrEqual(10);
      });
    });

    it('should return entries with tips array', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockBeautyEntry] });

      const result = await calendarsApi.getCalendar('beauty', 1, 2024);

      expect(Array.isArray(result[0].tips)).toBe(true);
      expect(result[0].tips.length).toBeGreaterThan(0);
    });

    it('should handle different months', async () => {
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockBeautyEntry] });

      for (const month of months) {
        await calendarsApi.getCalendar('beauty', month, 2024);

        expect(apiClient.get).toHaveBeenCalledWith('/calendars/beauty', {
          params: { month, year: 2024 },
        });
      }
    });

    it('should handle different years', async () => {
      const years = [2023, 2024, 2025];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockBeautyEntry] });

      for (const year of years) {
        await calendarsApi.getCalendar('beauty', 1, year);

        expect(apiClient.get).toHaveBeenCalledWith('/calendars/beauty', {
          params: { month: 1, year },
        });
      }
    });

    it('should return entries with date strings', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockBeautyEntry] });

      const result = await calendarsApi.getCalendar('beauty', 1, 2024);

      result.forEach((entry) => {
        expect(typeof entry.date).toBe('string');
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('should handle empty calendar', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await calendarsApi.getCalendar('beauty', 1, 2024);

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch calendar');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(calendarsApi.getCalendar('beauty', 1, 2024)).rejects.toThrow(
        'Failed to fetch calendar',
      );
    });
  });

  describe('getDay', () => {
    it('should get beauty calendar for specific day', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBeautyEntry });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(apiClient.get).toHaveBeenCalledWith('/calendars/beauty/day/2024-01-15');
      expect(result).toEqual(mockBeautyEntry);
    });

    it('should get health calendar for specific day', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockHealthEntry });

      const result = await calendarsApi.getDay('health', '2024-01-15');

      expect(result.type).toBe('health');
    });

    it('should get activity calendar for specific day', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockActivityEntry });

      const result = await calendarsApi.getDay('activity', '2024-01-15');

      expect(result.type).toBe('activity');
    });

    it('should get spiritual calendar for specific day', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockSpiritualEntry });

      const result = await calendarsApi.getDay('spiritual', '2024-01-15');

      expect(result.type).toBe('spiritual');
    });

    it('should get transit calendar for specific day', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTransitEntry });

      const result = await calendarsApi.getDay('transit', '2024-01-15');

      expect(result.type).toBe('transit');
    });

    it('should get moon calendar for specific day', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoonEntry });

      const result = await calendarsApi.getDay('moon', '2024-01-15');

      expect(result.type).toBe('moon');
    });

    it('should return entry with rating', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBeautyEntry });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(result.rating).toBeDefined();
      expect(typeof result.rating).toBe('number');
    });

    it('should return entry with tips', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBeautyEntry });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(Array.isArray(result.tips)).toBe(true);
      expect(result.tips.length).toBeGreaterThan(0);
    });

    it('should return entry with favorable activities', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBeautyEntry });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(result.favorableActivities).toBeDefined();
      expect(Array.isArray(result.favorableActivities)).toBe(true);
    });

    it('should return entry with unfavorable activities', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBeautyEntry });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(result.unfavorableActivities).toBeDefined();
      expect(Array.isArray(result.unfavorableActivities)).toBe(true);
    });

    it('should handle different date formats', async () => {
      const dates = ['2024-01-15', '2024-12-31', '2024-02-29'];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBeautyEntry });

      for (const date of dates) {
        await calendarsApi.getDay('beauty', date);

        expect(apiClient.get).toHaveBeenCalledWith(`/calendars/beauty/day/${date}`);
      }
    });

    it('should handle 404 when date not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Calendar entry not found' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(calendarsApi.getDay('beauty', '2024-01-15')).rejects.toEqual(
        mockError,
      );
    });

    it('should return entry matching requested date', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBeautyEntry });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(result.date).toBe('2024-01-15');
    });
  });

  describe('getAllCalendarsForDay', () => {
    it('should get all calendar entries for specific day', async () => {
      const mockAllEntries = [
        mockBeautyEntry,
        mockHealthEntry,
        mockActivityEntry,
        mockSpiritualEntry,
        mockTransitEntry,
        mockMoonEntry,
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAllEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      expect(apiClient.get).toHaveBeenCalledWith('/calendars/day/2024-01-15');
      expect(result).toEqual(mockAllEntries);
    });

    it('should return array of all calendar types', async () => {
      const mockAllEntries = [
        mockBeautyEntry,
        mockHealthEntry,
        mockActivityEntry,
        mockSpiritualEntry,
        mockTransitEntry,
        mockMoonEntry,
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAllEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(6);
    });

    it('should include all calendar types', async () => {
      const mockAllEntries = [
        mockBeautyEntry,
        mockHealthEntry,
        mockActivityEntry,
        mockSpiritualEntry,
        mockTransitEntry,
        mockMoonEntry,
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAllEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      const types = result.map((entry) => entry.type);
      expect(types).toContain('beauty');
      expect(types).toContain('health');
      expect(types).toContain('activity');
      expect(types).toContain('spiritual');
      expect(types).toContain('transit');
      expect(types).toContain('moon');
    });

    it('should return entries with same date', async () => {
      const mockAllEntries = [mockBeautyEntry, mockHealthEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAllEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      result.forEach((entry) => {
        expect(entry.date).toBe('2024-01-15');
      });
    });

    it('should return entries with ratings', async () => {
      const mockAllEntries = [mockBeautyEntry, mockHealthEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAllEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      result.forEach((entry) => {
        expect(entry.rating).toBeDefined();
        expect(typeof entry.rating).toBe('number');
      });
    });

    it('should return entries with tips', async () => {
      const mockAllEntries = [mockBeautyEntry, mockHealthEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAllEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      result.forEach((entry) => {
        expect(Array.isArray(entry.tips)).toBe(true);
        expect(entry.tips.length).toBeGreaterThan(0);
      });
    });

    it('should handle different dates', async () => {
      const dates = ['2024-01-01', '2024-06-15', '2024-12-31'];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      for (const date of dates) {
        await calendarsApi.getAllCalendarsForDay(date);

        expect(apiClient.get).toHaveBeenCalledWith(`/calendars/day/${date}`);
      }
    });

    it('should handle empty results', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      expect(result).toEqual([]);
    });

    it('should handle partial calendar data', async () => {
      const partialEntries = [mockBeautyEntry, mockHealthEntry];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: partialEntries });

      const result = await calendarsApi.getAllCalendarsForDay('2024-01-15');

      expect(result.length).toBe(2);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch calendars');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(calendarsApi.getAllCalendarsForDay('2024-01-15')).rejects.toThrow(
        'Failed to fetch calendars',
      );
    });

    it('should call API only once per request', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      await calendarsApi.getAllCalendarsForDay('2024-01-15');

      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('calendar types', () => {
    it('should support all calendar type values', () => {
      const types: CalendarType[] = [
        'beauty',
        'health',
        'activity',
        'spiritual',
        'transit',
        'moon',
      ];

      types.forEach((type) => {
        expect(['beauty', 'health', 'activity', 'spiritual', 'transit', 'moon']).toContain(
          type,
        );
      });
    });
  });

  describe('calendar entry structure', () => {
    it('should have optional favorableActivities field', async () => {
      const entryWithoutFavorable = {
        ...mockBeautyEntry,
        favorableActivities: undefined,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: entryWithoutFavorable });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(result.favorableActivities).toBeUndefined();
    });

    it('should have optional unfavorableActivities field', async () => {
      const entryWithoutUnfavorable = {
        ...mockBeautyEntry,
        unfavorableActivities: undefined,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: entryWithoutUnfavorable });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(result.unfavorableActivities).toBeUndefined();
    });

    it('should handle entries with empty activity arrays', async () => {
      const emptyActivitiesEntry = {
        ...mockBeautyEntry,
        favorableActivities: [],
        unfavorableActivities: [],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: emptyActivitiesEntry });

      const result = await calendarsApi.getDay('beauty', '2024-01-15');

      expect(result.favorableActivities).toEqual([]);
      expect(result.unfavorableActivities).toEqual([]);
    });
  });
});
