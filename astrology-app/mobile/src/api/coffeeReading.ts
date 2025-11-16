import client from './client';

export interface CoffeeReading {
  id: string;
  imageUrls: string[];
  overallVibe: string;
  love: string;
  workAndMoney: string;
  predictions: string;
  createdAt: string;
}

export const coffeeReadingApi = {
  createReading: async (formData: FormData): Promise<CoffeeReading> => {
    const response = await client.post('/coffee-reading', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReadingHistory: async (): Promise<CoffeeReading[]> => {
    const response = await client.get('/coffee-reading/history');
    return response.data;
  },

  getReading: async (readingId: string): Promise<CoffeeReading> => {
    const response = await client.get(`/coffee-reading/${readingId}`);
    return response.data;
  },
};
