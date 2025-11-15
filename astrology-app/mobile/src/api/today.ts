import apiClient from './client';

export interface TodaySummary {
  profile: {
    id: string;
    name: string;
    sunSign: string;
  };
  date: string;
  forecast: {
    general: string;
    love: string;
    career: string;
    health: string;
    scores: {
      overall: number;
      love: number;
      career: number;
      health: number;
    };
    luckyNumbers: string[];
    luckyColor: string;
    luckyGem: string;
  };
  starMessage: {
    message: string;
    theme: string;
    keywords: string[];
  };
  moon: {
    phase: string;
    sign: string;
    illumination: number;
  };
  keyTransit: {
    title: string;
    description: string;
    type: string;
  } | null;
  calendars: {
    beauty: { rating: number; tip: string };
    health: { rating: number; tip: string };
    activity: { rating: number; tip: string };
    spiritual: { rating: number; tip: string };
  };
  upcomingEvents: Array<{
    title: string;
    date: string;
    type: string;
  }>;
}

export const todayApi = {
  getTodaySummary: async (profileId?: string): Promise<TodaySummary> => {
    const params = profileId ? { profileId } : {};
    const response = await apiClient.get('/today', { params });
    return response.data;
  },
};
