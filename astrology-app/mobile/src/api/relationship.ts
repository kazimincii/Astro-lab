import apiClient from './client';

export interface RelationshipProfile {
  id: string;
  userId: string;
  person1Id: string;
  person2Id: string;
  compatibilityScores: {
    overall: number;
    emotional: number;
    communication: number;
    values: number;
    physical: number;
  };
  summary: string;
  timeline: {
    past6Months: Array<{
      date: string;
      theme: string;
      description: string;
    }>;
    next6Months: Array<{
      date: string;
      theme: string;
      description: string;
    }>;
  } | null;
  strengths: string | null;
  challenges: string | null;
  advice: string | null;
  createdAt: string;
  updatedAt: string;
}

export const relationshipApi = {
  analyzeCompatibility: async (
    person1Id: string,
    person2Id: string
  ): Promise<RelationshipProfile> => {
    const response = await apiClient.post('/relationship/analyze', { person1Id, person2Id });
    return response.data;
  },

  getRelationship: async (person1Id: string, person2Id: string): Promise<RelationshipProfile> => {
    const response = await apiClient.get('/relationship', {
      params: { person1Id, person2Id },
    });
    return response.data;
  },
};
