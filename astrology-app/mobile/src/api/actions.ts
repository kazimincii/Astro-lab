import client from './client';

export interface ActionsData {
  dailyLimit: number;
  used: number;
  remaining: number;
  planType: string;
  resetsAt: string;
}

export interface EffectivePlan {
  planType: 'basic' | 'standard' | 'premium';
  source: 'trial' | 'subscription' | 'default';
  dailyActionLimit: number;
  maxProfiles: number;
  features: string[];
  trial?: {
    startDate: string;
    endDate: string;
    daysRemaining: number;
  };
  subscription?: {
    startDate: string;
    endDate?: string;
    status: string;
  };
}

export const actionsApi = {
  getRemainingActions: async (): Promise<ActionsData> => {
    const response = await client.get('/actions/remaining');
    return response.data;
  },

  getEffectivePlan: async (): Promise<EffectivePlan> => {
    const response = await client.get('/subscriptions/effective-plan');
    return response.data;
  },
};
