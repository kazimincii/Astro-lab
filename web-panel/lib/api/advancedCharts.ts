import apiClient from './client';

export enum AdvancedChartType {
  TRANSIT = 'transit',
  PROGRESSED = 'progressed',
  SYNASTRY = 'synastry',
  COMPOSITE = 'composite',
  DAVISON = 'davison',
  SOLAR_RETURN = 'solar_return',
  LUNAR_RETURN = 'lunar_return',
  SOLAR_ARCS = 'solar_arcs',
}

export enum ChartMode {
  BASIC = 'basic',
  PRO = 'pro',
}

export interface AdvancedChart {
  id: string;
  userId: string;
  person1Id: string | null;
  person2Id: string | null;
  chartType: AdvancedChartType;
  mode: ChartMode;
  targetDate: string | null;
  chartData: any;
  interpretation: string | null;
  metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export const advancedChartsApi = {
  generateAdvancedChart: async (
    chartType: AdvancedChartType,
    person1Id: string,
    person2Id?: string,
    targetDate?: string,
    mode?: ChartMode
  ): Promise<AdvancedChart> => {
    const response = await apiClient.post('/advanced-charts/generate', {
      chartType,
      person1Id,
      person2Id,
      targetDate,
      mode,
    });
    return response.data;
  },

  getUserCharts: async (chartType?: AdvancedChartType): Promise<AdvancedChart[]> => {
    const params = chartType ? { chartType } : {};
    const response = await apiClient.get('/advanced-charts', { params });
    return response.data;
  },

  getChart: async (chartId: string): Promise<AdvancedChart> => {
    const response = await apiClient.get(`/advanced-charts/${chartId}`);
    return response.data;
  },
};
