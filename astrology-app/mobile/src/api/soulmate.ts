import apiClient from './client';

export interface SoulmateProfile {
  id: string;
  personId: string;
  archetype: string;
  description: string;
  meetingScenarios: Array<{
    context: string;
    description: string;
    probability: number;
  }>;
  partnerPreferences: {
    sunSigns: string[];
    moonSigns: string[];
    risingSigns: string[];
    venusSign: string;
    marsSign: string;
    traits: string[];
  } | null;
  idealPartnerQualities: string[] | null;
  relationshipGuidance: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum ConnectionType {
  FRIEND = 'friend',
  ROMANTIC = 'romantic',
  MENTOR = 'mentor',
  OTHER = 'other',
}

export interface UserConnection {
  id: string;
  user1Id: string;
  user2Id: string;
  type: ConnectionType;
  status: string;
  createdAt: string;
}

export const soulmateApi = {
  generateSoulmateProfile: async (personId: string): Promise<SoulmateProfile> => {
    const response = await apiClient.post(`/soulmate/${personId}/generate`);
    return response.data;
  },

  getSoulmateProfile: async (personId: string): Promise<SoulmateProfile> => {
    const response = await apiClient.get(`/soulmate/${personId}`);
    return response.data;
  },

  findMatches: async (): Promise<any[]> => {
    const response = await apiClient.get('/soulmate/matches');
    return response.data;
  },

  createConnection: async (user2Id: string, type: ConnectionType): Promise<UserConnection> => {
    const response = await apiClient.post('/soulmate/connect', { user2Id, type });
    return response.data;
  },

  acceptConnection: async (connectionId: string): Promise<UserConnection> => {
    const response = await apiClient.post(`/soulmate/connection/${connectionId}/accept`);
    return response.data;
  },
};
