import { apiClient } from './client';

export interface Expert {
  id: string;
  name: string;
  type: string;
  bio: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  pricePerSession: number;
  availability: string[];
}

export interface Session {
  id: string;
  expertId: string;
  userId: string;
  type: string;
  status: string;
  scheduledAt?: string;
  meetingLink?: string;
  notes?: string;
}

export const liveServicesApi = {
  getExperts: async (type?: string): Promise<Expert[]> => {
    const response = await apiClient.get('/live-services/experts', {
      params: type ? { type } : {},
    });
    return response.data;
  },

  getExpert: async (expertId: string): Promise<Expert> => {
    const response = await apiClient.get(`/live-services/experts/${expertId}`);
    return response.data;
  },

  requestSession: async (expertId: string, data: any): Promise<Session> => {
    const response = await apiClient.post(`/live-services/request/${expertId}`, data);
    return response.data;
  },

  getMySessions: async (): Promise<Session[]> => {
    const response = await apiClient.get('/live-services/sessions/my');
    return response.data;
  },

  rateSession: async (sessionId: string, rating: number, review: string): Promise<void> => {
    await apiClient.post(`/live-services/sessions/${sessionId}/rate`, {
      rating,
      review,
    });
  },
};
