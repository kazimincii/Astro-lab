import { apiClient } from './client';

export interface FamousPerson {
  id: string;
  name: string;
  profession: string;
  category: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  matchReason: string;
  imageUrl?: string;
  popularity: number;
}

export const famousPeopleApi = {
  getMatches: async (profileId: string): Promise<FamousPerson[]> => {
    const response = await apiClient.get(`/famous-people/matches/${profileId}`);
    return response.data;
  },

  searchByCategory: async (category: string): Promise<FamousPerson[]> => {
    const response = await apiClient.get('/famous-people/search', {
      params: { category },
    });
    return response.data;
  },

  getPerson: async (personId: string): Promise<FamousPerson> => {
    const response = await apiClient.get(`/famous-people/${personId}`);
    return response.data;
  },
};
