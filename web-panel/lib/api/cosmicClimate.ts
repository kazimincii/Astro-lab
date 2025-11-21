import { apiClient } from './client';

export interface CosmicClimatePost {
  id: string;
  date: string;
  moonPhase: string;
  moonSign: string;
  energy: string;
  majorAspects: string[];
  retrogrades: string[];
  themes: string[];
  recommendations: string[];
  reactionCounts: { [emoji: string]: number };
}

export const cosmicClimateApi = {
  getToday: async (): Promise<CosmicClimatePost> => {
    const response = await apiClient.get('/cosmic-climate/today');
    return response.data;
  },

  getRecent: async (limit: number = 7): Promise<CosmicClimatePost[]> => {
    const response = await apiClient.get('/cosmic-climate/recent', {
      params: { limit },
    });
    return response.data;
  },

  getByDate: async (date: string): Promise<CosmicClimatePost> => {
    const response = await apiClient.get(`/cosmic-climate/date/${date}`);
    return response.data;
  },

  react: async (postId: string, emoji: string): Promise<void> => {
    await apiClient.post(`/cosmic-climate/${postId}/react`, { emoji });
  },
};
