import { apiClient } from './client';

export type SubscriptionUsage = {
  plan: string;
  dailyActionLimit: number;
  unlimitedActions: boolean;
  profileLimit: number;
  actionsUsedToday: number;
  actionsRemaining: number | null;
  profilesUsed: number;
};

export const subscriptionsApi = {
  getUsage: async (): Promise<SubscriptionUsage> => {
    const response = await apiClient.get('/subscriptions/usage');
    return response.data;
  },
};
