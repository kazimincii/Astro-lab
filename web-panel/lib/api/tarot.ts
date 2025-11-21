import { apiClient } from './client';

export interface TarotReading {
  id: string;
  spreadType: string;
  spreadName: string;
  cards: Array<{
    name: string;
    position: string;
    reversed: boolean;
    meaning: string;
  }>;
  interpretation: string;
  createdAt: string;
}

export const tarotApi = {
  createReading: async (spreadType: string, question?: string): Promise<TarotReading> => {
    const response = await apiClient.post('/tarot/reading', { spreadType, question });
    return response.data;
  },

  getReadingHistory: async (): Promise<TarotReading[]> => {
    const response = await apiClient.get('/tarot/history');
    return response.data;
  },

  getReading: async (readingId: string): Promise<TarotReading> => {
    const response = await apiClient.get(`/tarot/${readingId}`);
    return response.data;
  },
};
