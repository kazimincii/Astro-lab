import client from './client';

export interface AuraReading {
  id: string;
  archetype: string;
  sections: {
    vibe: string;
    communication: string;
    relationship: string;
    strengths: string[];
    watchOuts: string[];
  };
  imageUrl: string;
  createdAt: string;
}

export const auraScanApi = {
  createReading: async (formData: FormData): Promise<AuraReading> => {
    const response = await client.post('/aura-scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReadingHistory: async (): Promise<AuraReading[]> => {
    const response = await client.get('/aura-scan/history');
    return response.data;
  },

  getReading: async (readingId: string): Promise<AuraReading> => {
    const response = await client.get(`/aura-scan/${readingId}`);
    return response.data;
  },
};
