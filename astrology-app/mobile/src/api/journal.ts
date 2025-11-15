import apiClient from './client';

export enum MoodLevel {
  VERY_BAD = 1,
  BAD = 2,
  NEUTRAL = 3,
  GOOD = 4,
  VERY_GOOD = 5,
}

export interface JournalEntry {
  id: string;
  userId: string;
  personId: string | null;
  entryDate: string;
  mood: MoodLevel | null;
  content: string | null;
  tags: string[] | null;
  reflectionPrompt: string | null;
  metadata: {
    weatherMood: string;
    majorTransits: string[];
    moonPhase: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface MoodStats {
  averageMood: number;
  totalEntries: number;
  moodDistribution: Record<string, number>;
  moodTrend: Array<{ date: string; mood: number }>;
}

export const journalApi = {
  createEntry: async (
    entryDate: string,
    mood: MoodLevel,
    content: string,
    tags: string[],
    personId?: string
  ): Promise<JournalEntry> => {
    const response = await apiClient.post('/journal', {
      entryDate,
      mood,
      content,
      tags,
      personId,
    });
    return response.data;
  },

  updateEntry: async (entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> => {
    const response = await apiClient.put(`/journal/${entryId}`, updates);
    return response.data;
  },

  deleteEntry: async (entryId: string): Promise<void> => {
    await apiClient.delete(`/journal/${entryId}`);
  },

  getUserEntries: async (startDate?: string, endDate?: string): Promise<JournalEntry[]> => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get('/journal', { params });
    return response.data;
  },

  getMoodStats: async (days: number = 30): Promise<MoodStats> => {
    const response = await apiClient.get('/journal/stats', { params: { days } });
    return response.data;
  },

  getEntryByDate: async (date: string): Promise<JournalEntry | null> => {
    const response = await apiClient.get(`/journal/date/${date}`);
    return response.data;
  },
};
