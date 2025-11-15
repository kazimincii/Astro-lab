import { apiClient } from './client';

export const profilesApi = {
  getAll: async () => {
    const response = await apiClient.get('/profiles');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await apiClient.get(`/profiles/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/profiles', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/profiles/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/profiles/${id}`);
    return response.data;
  },
};
