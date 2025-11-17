import { apiClient } from './client';

export interface NumerologyProfile {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  personalYear: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

export interface NumerologyComparison {
  compatibility: number;
  strengths: string[];
  challenges: string[];
  advice: string;
}

export const numerologyApi = {
  getProfile: async (profileId: string): Promise<NumerologyProfile> => {
    const response = await apiClient.get(`/numerology/profile/${profileId}`);
    return response.data;
  },

  compareProfiles: async (
    profileId1: string,
    profileId2: string
  ): Promise<NumerologyComparison> => {
    const response = await apiClient.post('/numerology/compare', {
      profileId1,
      profileId2,
    });
    return response.data;
  },

  analyzeNumber: async (number: string, type: string): Promise<any> => {
    const response = await apiClient.post('/numerology/analyze', { number, type });
    return response.data;
  },
};
