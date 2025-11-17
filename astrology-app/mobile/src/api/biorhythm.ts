import apiClient from './client';

export interface BiorhythmProfile {
  id: string;
  personId: string;
  calculatedDate: string;
  data: {
    physical: number;
    emotional: number;
    intellectual: number;
    criticalDays: string[];
    nextPeaks: {
      physical: string;
      emotional: string;
      intellectual: string;
    };
  };
  commentary: string | null;
  createdAt: string;
  updatedAt: string;
}

export const biorhythmApi = {
  calculateBiorhythm: async (personId: string, date?: string): Promise<BiorhythmProfile> => {
    const response = await apiClient.post(`/biorhythm/${personId}/calculate`, { date });
    return response.data;
  },

  getLatestBiorhythm: async (personId: string): Promise<BiorhythmProfile> => {
    const response = await apiClient.get(`/biorhythm/${personId}/latest`);
    return response.data;
  },
};
