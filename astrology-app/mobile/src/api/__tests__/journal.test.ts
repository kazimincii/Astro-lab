import { journalApi, JournalEntry, MoodLevel, MoodStats } from '../journal';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('journalApi', () => {
  const mockJournalEntry: JournalEntry = {
    id: 'journal-123',
    userId: 'user-123',
    personId: 'person-456',
    entryDate: '2024-01-15',
    mood: MoodLevel.GOOD,
    content: 'Had a great day today. Felt very productive and positive.',
    tags: ['productive', 'positive', 'work'],
    reflectionPrompt: 'What made today special?',
    metadata: {
      weatherMood: 'sunny',
      majorTransits: ['Mars in Aries'],
      moonPhase: 'Waxing Crescent',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  const mockMoodStats: MoodStats = {
    averageMood: 3.8,
    totalEntries: 25,
    moodDistribution: {
      '1': 2,
      '2': 3,
      '3': 8,
      '4': 10,
      '5': 2,
    },
    moodTrend: [
      { date: '2024-01-01', mood: 4 },
      { date: '2024-01-02', mood: 3 },
      { date: '2024-01-03', mood: 5 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEntry', () => {
    it('should create a new journal entry', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockJournalEntry });

      const result = await journalApi.createEntry(
        '2024-01-15',
        MoodLevel.GOOD,
        'Great day!',
        ['positive'],
        'person-456',
      );

      expect(apiClient.post).toHaveBeenCalledWith('/journal', {
        entryDate: '2024-01-15',
        mood: MoodLevel.GOOD,
        content: 'Great day!',
        tags: ['positive'],
        personId: 'person-456',
      });
      expect(result).toEqual(mockJournalEntry);
    });

    it('should create entry without personId', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockJournalEntry });

      await journalApi.createEntry(
        '2024-01-15',
        MoodLevel.GOOD,
        'Great day!',
        ['positive'],
      );

      expect(apiClient.post).toHaveBeenCalledWith('/journal', {
        entryDate: '2024-01-15',
        mood: MoodLevel.GOOD,
        content: 'Great day!',
        tags: ['positive'],
        personId: undefined,
      });
    });

    it('should create entry with different mood levels', async () => {
      const moodLevels = [
        MoodLevel.VERY_BAD,
        MoodLevel.BAD,
        MoodLevel.NEUTRAL,
        MoodLevel.GOOD,
        MoodLevel.VERY_GOOD,
      ];

      for (const mood of moodLevels) {
        (apiClient.post as jest.Mock).mockResolvedValue({
          data: { ...mockJournalEntry, mood },
        });

        const result = await journalApi.createEntry(
          '2024-01-15',
          mood,
          'Test content',
          [],
        );

        expect(result.mood).toBe(mood);
      }
    });

    it('should create entry with multiple tags', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockJournalEntry });

      await journalApi.createEntry(
        '2024-01-15',
        MoodLevel.GOOD,
        'Great day!',
        ['work', 'exercise', 'friends', 'productivity'],
      );

      expect(apiClient.post).toHaveBeenCalledWith('/journal', {
        entryDate: '2024-01-15',
        mood: MoodLevel.GOOD,
        content: 'Great day!',
        tags: ['work', 'exercise', 'friends', 'productivity'],
        personId: undefined,
      });
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to create entry');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        journalApi.createEntry('2024-01-15', MoodLevel.GOOD, 'Test', []),
      ).rejects.toThrow('Failed to create entry');
    });
  });

  describe('updateEntry', () => {
    it('should update journal entry', async () => {
      const updates = {
        mood: MoodLevel.VERY_GOOD,
        content: 'Updated content',
        tags: ['updated'],
      };

      const updatedEntry = { ...mockJournalEntry, ...updates };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: updatedEntry });

      const result = await journalApi.updateEntry('journal-123', updates);

      expect(apiClient.put).toHaveBeenCalledWith('/journal/journal-123', updates);
      expect(result).toEqual(updatedEntry);
    });

    it('should update single field', async () => {
      const updates = { mood: MoodLevel.BAD };
      (apiClient.put as jest.Mock).mockResolvedValue({
        data: { ...mockJournalEntry, ...updates },
      });

      await journalApi.updateEntry('journal-123', updates);

      expect(apiClient.put).toHaveBeenCalledWith('/journal/journal-123', updates);
    });

    it('should update content only', async () => {
      const updates = { content: 'New reflections on the day' };
      (apiClient.put as jest.Mock).mockResolvedValue({
        data: { ...mockJournalEntry, ...updates },
      });

      await journalApi.updateEntry('journal-123', updates);

      expect(apiClient.put).toHaveBeenCalledWith('/journal/journal-123', updates);
    });

    it('should update tags', async () => {
      const updates = { tags: ['new', 'tags'] };
      (apiClient.put as jest.Mock).mockResolvedValue({
        data: { ...mockJournalEntry, ...updates },
      });

      await journalApi.updateEntry('journal-123', updates);

      expect(apiClient.put).toHaveBeenCalledWith('/journal/journal-123', updates);
    });

    it('should handle 404 when entry not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Entry not found' },
        },
      };
      (apiClient.put as jest.Mock).mockRejectedValue(mockError);

      await expect(
        journalApi.updateEntry('non-existent', { mood: MoodLevel.GOOD }),
      ).rejects.toEqual(mockError);
    });
  });

  describe('deleteEntry', () => {
    it('should delete journal entry', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});

      await journalApi.deleteEntry('journal-123');

      expect(apiClient.delete).toHaveBeenCalledWith('/journal/journal-123');
    });

    it('should handle 404 when entry not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Entry not found' },
        },
      };
      (apiClient.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(journalApi.deleteEntry('non-existent')).rejects.toEqual(mockError);
    });

    it('should not return data after deletion', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});

      const result = await journalApi.deleteEntry('journal-123');

      expect(result).toBeUndefined();
    });
  });

  describe('getUserEntries', () => {
    it('should get all user entries without date filters', async () => {
      const mockEntries = [mockJournalEntry];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await journalApi.getUserEntries();

      expect(apiClient.get).toHaveBeenCalledWith('/journal', { params: {} });
      expect(result).toEqual(mockEntries);
    });

    it('should get entries with start date filter', async () => {
      const mockEntries = [mockJournalEntry];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await journalApi.getUserEntries('2024-01-01');

      expect(apiClient.get).toHaveBeenCalledWith('/journal', {
        params: { startDate: '2024-01-01' },
      });
      expect(result).toEqual(mockEntries);
    });

    it('should get entries with end date filter', async () => {
      const mockEntries = [mockJournalEntry];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await journalApi.getUserEntries(undefined, '2024-01-31');

      expect(apiClient.get).toHaveBeenCalledWith('/journal', {
        params: { endDate: '2024-01-31' },
      });
      expect(result).toEqual(mockEntries);
    });

    it('should get entries with both start and end date filters', async () => {
      const mockEntries = [mockJournalEntry];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await journalApi.getUserEntries('2024-01-01', '2024-01-31');

      expect(apiClient.get).toHaveBeenCalledWith('/journal', {
        params: { startDate: '2024-01-01', endDate: '2024-01-31' },
      });
      expect(result).toEqual(mockEntries);
    });

    it('should return empty array when no entries exist', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await journalApi.getUserEntries();

      expect(result).toEqual([]);
    });

    it('should return multiple entries', async () => {
      const mockEntries = [
        mockJournalEntry,
        { ...mockJournalEntry, id: 'journal-456', entryDate: '2024-01-16' },
        { ...mockJournalEntry, id: 'journal-789', entryDate: '2024-01-17' },
      ];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEntries });

      const result = await journalApi.getUserEntries();

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockEntries);
    });
  });

  describe('getMoodStats', () => {
    it('should get mood statistics for default 30 days', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoodStats });

      const result = await journalApi.getMoodStats();

      expect(apiClient.get).toHaveBeenCalledWith('/journal/stats', {
        params: { days: 30 },
      });
      expect(result).toEqual(mockMoodStats);
    });

    it('should get mood statistics for custom number of days', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoodStats });

      const result = await journalApi.getMoodStats(90);

      expect(apiClient.get).toHaveBeenCalledWith('/journal/stats', {
        params: { days: 90 },
      });
      expect(result).toEqual(mockMoodStats);
    });

    it('should return average mood', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoodStats });

      const result = await journalApi.getMoodStats();

      expect(result.averageMood).toBeDefined();
      expect(typeof result.averageMood).toBe('number');
      expect(result.averageMood).toBe(3.8);
    });

    it('should return total entries count', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoodStats });

      const result = await journalApi.getMoodStats();

      expect(result.totalEntries).toBeDefined();
      expect(typeof result.totalEntries).toBe('number');
      expect(result.totalEntries).toBe(25);
    });

    it('should return mood distribution', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoodStats });

      const result = await journalApi.getMoodStats();

      expect(result.moodDistribution).toBeDefined();
      expect(typeof result.moodDistribution).toBe('object');
      expect(result.moodDistribution).toHaveProperty('1');
      expect(result.moodDistribution).toHaveProperty('5');
    });

    it('should return mood trend', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoodStats });

      const result = await journalApi.getMoodStats();

      expect(result.moodTrend).toBeDefined();
      expect(Array.isArray(result.moodTrend)).toBe(true);
      expect(result.moodTrend[0]).toHaveProperty('date');
      expect(result.moodTrend[0]).toHaveProperty('mood');
    });

    it('should handle different time periods', async () => {
      const periods = [7, 30, 60, 90, 365];

      for (const days of periods) {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoodStats });

        await journalApi.getMoodStats(days);

        expect(apiClient.get).toHaveBeenCalledWith('/journal/stats', {
          params: { days },
        });
      }
    });
  });

  describe('getEntryByDate', () => {
    it('should get journal entry for specific date', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockJournalEntry });

      const result = await journalApi.getEntryByDate('2024-01-15');

      expect(apiClient.get).toHaveBeenCalledWith('/journal/date/2024-01-15');
      expect(result).toEqual(mockJournalEntry);
    });

    it('should return null when no entry exists for date', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: null });

      const result = await journalApi.getEntryByDate('2024-01-20');

      expect(result).toBeNull();
    });

    it('should handle different date formats', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockJournalEntry });

      await journalApi.getEntryByDate('2024-12-31');

      expect(apiClient.get).toHaveBeenCalledWith('/journal/date/2024-12-31');
    });

    it('should handle 404 when entry not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Entry not found for this date' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(journalApi.getEntryByDate('2024-01-20')).rejects.toEqual(
        mockError,
      );
    });
  });

  describe('mood levels', () => {
    it('should have correct mood level values', () => {
      expect(MoodLevel.VERY_BAD).toBe(1);
      expect(MoodLevel.BAD).toBe(2);
      expect(MoodLevel.NEUTRAL).toBe(3);
      expect(MoodLevel.GOOD).toBe(4);
      expect(MoodLevel.VERY_GOOD).toBe(5);
    });
  });

  describe('journal entry structure', () => {
    it('should include all required fields in journal entry', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockJournalEntry });

      const result = await journalApi.createEntry(
        '2024-01-15',
        MoodLevel.GOOD,
        'Test',
        [],
      );

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('personId');
      expect(result).toHaveProperty('entryDate');
      expect(result).toHaveProperty('mood');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tags');
      expect(result).toHaveProperty('reflectionPrompt');
      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should include metadata with astrological information', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockJournalEntry });

      const result = await journalApi.createEntry(
        '2024-01-15',
        MoodLevel.GOOD,
        'Test',
        [],
      );

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.weatherMood).toBeDefined();
      expect(result.metadata?.majorTransits).toBeDefined();
      expect(result.metadata?.moonPhase).toBeDefined();
    });
  });
});
