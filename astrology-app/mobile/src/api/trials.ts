import client from './client';

export interface Trial {
  id: string;
  userId: string;
  planType: 'standard' | 'premium';
  startDate: string;
  endDate: string;
  status: string;
}

export const trialsApi = {
  startTrial: async (planType: 'standard' | 'premium'): Promise<Trial> => {
    const response = await client.post('/trials/start', { planType });
    return response.data;
  },

  getActiveTrial: async (): Promise<Trial | null> => {
    const response = await client.get('/trials/active');
    return response.data;
  },

  cancelTrial: async (): Promise<void> => {
    await client.post('/trials/cancel');
  },
};
