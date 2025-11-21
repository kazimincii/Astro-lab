import apiClient from './client';

export enum ChakraStatus {
  UNDERACTIVE = 'underactive',
  BALANCED = 'balanced',
  OVERACTIVE = 'overactive',
}

export interface ChakraState {
  name: string;
  status: ChakraStatus;
  score: number;
  tips: string[];
}

export interface ChakraProfile {
  id: string;
  personId: string;
  chakraStates: {
    root: ChakraState;
    sacral: ChakraState;
    solarPlexus: ChakraState;
    heart: ChakraState;
    throat: ChakraState;
    thirdEye: ChakraState;
    crown: ChakraState;
  };
  overallGuidance: string | null;
  meditation: {
    recommended: string[];
    breathwork: string[];
  } | null;
  createdAt: string;
  updatedAt: string;
}

export const chakrasApi = {
  generateChakraProfile: async (personId: string): Promise<ChakraProfile> => {
    const response = await apiClient.post(`/chakras/${personId}/generate`);
    return response.data;
  },

  getChakraProfile: async (personId: string): Promise<ChakraProfile> => {
    const response = await apiClient.get(`/chakras/${personId}`);
    return response.data;
  },
};
