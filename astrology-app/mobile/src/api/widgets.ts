import apiClient from './client';

export enum WidgetType {
  MOON_PHASE = 'moon_phase',
  STAR_MESSAGE = 'star_message',
  TODAY_SUMMARY = 'today_summary',
  DAILY_FORECAST = 'daily_forecast',
}

export interface WidgetConfig {
  id: string;
  userId: string;
  widgetType: WidgetType;
  data: {
    primaryPersonId?: string;
    refreshInterval?: number;
    theme?: string;
    size?: string;
    customization?: any;
  };
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const widgetsApi = {
  getUserWidgets: async (): Promise<WidgetConfig[]> => {
    const response = await apiClient.get('/widgets');
    return response.data;
  },

  getWidget: async (widgetType: WidgetType): Promise<WidgetConfig> => {
    const response = await apiClient.get(`/widgets/${widgetType}`);
    return response.data;
  },

  getWidgetData: async (widgetType: WidgetType): Promise<any> => {
    const response = await apiClient.get(`/widgets/${widgetType}/data`);
    return response.data;
  },

  createOrUpdateWidget: async (widgetType: WidgetType, data: any): Promise<WidgetConfig> => {
    const response = await apiClient.post(`/widgets/${widgetType}`, { data });
    return response.data;
  },

  toggleWidget: async (widgetType: WidgetType, isEnabled: boolean): Promise<WidgetConfig> => {
    const response = await apiClient.put(`/widgets/${widgetType}/toggle`, { isEnabled });
    return response.data;
  },

  deleteWidget: async (widgetType: WidgetType): Promise<void> => {
    await apiClient.delete(`/widgets/${widgetType}`);
  },
};
