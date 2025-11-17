import { apiClient } from './client';

export type DailyForecastResponse = {
  id: string;
  profileId: string;
  date: string;
  sunSign: string;
  generalForecast: string;
  loveForecast?: string;
  careerForecast?: string;
  healthForecast?: string;
  luckyNumbers?: string[];
  luckyColor?: string;
  luckyGem?: string;
  loveScore?: number | null;
  careerScore?: number | null;
  healthScore?: number | null;
  overallScore?: number | null;
  planetaryTransits?: Record<
    string,
    { planet: string; theme: string; guidance: string }
  >;
};

export const forecastsApi = {
  getToday: async (profileId: string): Promise<DailyForecastResponse> => {
    const response = await apiClient.get(`/forecasts/today/${profileId}`);
    return response.data;
  },
};
