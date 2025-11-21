import { widgetsApi, WidgetType, WidgetConfig } from '../widgets';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('widgetsApi', () => {
  const mockWidgetConfig: WidgetConfig = {
    id: 'widget-123',
    userId: 'user-456',
    widgetType: WidgetType.MOON_PHASE,
    data: {
      primaryPersonId: 'person-789',
      refreshInterval: 3600,
      theme: 'dark',
      size: 'medium',
      customization: {
        showPhaseDetails: true,
        showTransitionDates: true,
      },
    },
    isEnabled: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  const mockMoonPhaseData = {
    phase: 'Waxing Gibbous',
    illumination: 0.78,
    age: 10.5,
    nextFullMoon: '2024-01-20T05:30:00Z',
    nextNewMoon: '2024-02-04T12:00:00Z',
    zodiacSign: 'Sagittarius',
    guidance: 'A time for building momentum and refining your intentions.',
  };

  const mockStarMessageData = {
    message: 'Trust the process. Your patience will be rewarded.',
    category: 'wisdom',
    author: 'The Stars',
    validUntil: '2024-01-16T00:00:00Z',
  };

  const mockTodaySummaryData = {
    date: '2024-01-15',
    overallScore: 8.5,
    primaryMessage: 'Today brings opportunities for growth and connection.',
    highlights: [
      'Strong creative energy',
      'Favorable for communication',
      'Good time for planning',
    ],
    cautions: [
      'Avoid impulsive decisions',
      'Take time for self-care',
    ],
    luckyColor: '#FF5733',
    luckyNumber: '7',
  };

  const mockDailyForecastData = {
    sunSign: 'Aries',
    generalForecast: 'A dynamic day filled with possibilities.',
    loveScore: 7.5,
    careerScore: 8.5,
    healthScore: 6.5,
    overallScore: 7.5,
    luckyNumbers: ['7', '14', '21'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserWidgets', () => {
    it('should get all user widgets', async () => {
      const mockWidgets = [
        mockWidgetConfig,
        { ...mockWidgetConfig, id: 'widget-456', widgetType: WidgetType.STAR_MESSAGE },
        { ...mockWidgetConfig, id: 'widget-789', widgetType: WidgetType.TODAY_SUMMARY },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockWidgets });

      const result = await widgetsApi.getUserWidgets();

      expect(apiClient.get).toHaveBeenCalledWith('/widgets');
      expect(result).toEqual(mockWidgets);
    });

    it('should return array of widget configs', async () => {
      const mockWidgets = [mockWidgetConfig];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockWidgets });

      const result = await widgetsApi.getUserWidgets();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('should return empty array when no widgets exist', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await widgetsApi.getUserWidgets();

      expect(result).toEqual([]);
    });

    it('should return widgets with all required fields', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [mockWidgetConfig] });

      const result = await widgetsApi.getUserWidgets();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('userId');
      expect(result[0]).toHaveProperty('widgetType');
      expect(result[0]).toHaveProperty('data');
      expect(result[0]).toHaveProperty('isEnabled');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
    });

    it('should return widgets of different types', async () => {
      const mockWidgets = [
        { ...mockWidgetConfig, widgetType: WidgetType.MOON_PHASE },
        { ...mockWidgetConfig, id: 'w2', widgetType: WidgetType.STAR_MESSAGE },
        { ...mockWidgetConfig, id: 'w3', widgetType: WidgetType.TODAY_SUMMARY },
        { ...mockWidgetConfig, id: 'w4', widgetType: WidgetType.DAILY_FORECAST },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockWidgets });

      const result = await widgetsApi.getUserWidgets();

      const widgetTypes = result.map(w => w.widgetType);
      expect(widgetTypes).toContain(WidgetType.MOON_PHASE);
      expect(widgetTypes).toContain(WidgetType.STAR_MESSAGE);
      expect(widgetTypes).toContain(WidgetType.TODAY_SUMMARY);
      expect(widgetTypes).toContain(WidgetType.DAILY_FORECAST);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch widgets');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(widgetsApi.getUserWidgets()).rejects.toThrow('Failed to fetch widgets');
    });

    it('should call API only once', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      await widgetsApi.getUserWidgets();

      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWidget', () => {
    it('should get specific widget by type', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockWidgetConfig });

      const result = await widgetsApi.getWidget(WidgetType.MOON_PHASE);

      expect(apiClient.get).toHaveBeenCalledWith('/widgets/moon_phase');
      expect(result).toEqual(mockWidgetConfig);
    });

    it('should get moon phase widget', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockWidgetConfig });

      const result = await widgetsApi.getWidget(WidgetType.MOON_PHASE);

      expect(result.widgetType).toBe(WidgetType.MOON_PHASE);
    });

    it('should get star message widget', async () => {
      const starWidget = { ...mockWidgetConfig, widgetType: WidgetType.STAR_MESSAGE };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: starWidget });

      const result = await widgetsApi.getWidget(WidgetType.STAR_MESSAGE);

      expect(result.widgetType).toBe(WidgetType.STAR_MESSAGE);
    });

    it('should get today summary widget', async () => {
      const todayWidget = { ...mockWidgetConfig, widgetType: WidgetType.TODAY_SUMMARY };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: todayWidget });

      const result = await widgetsApi.getWidget(WidgetType.TODAY_SUMMARY);

      expect(result.widgetType).toBe(WidgetType.TODAY_SUMMARY);
    });

    it('should get daily forecast widget', async () => {
      const forecastWidget = { ...mockWidgetConfig, widgetType: WidgetType.DAILY_FORECAST };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: forecastWidget });

      const result = await widgetsApi.getWidget(WidgetType.DAILY_FORECAST);

      expect(result.widgetType).toBe(WidgetType.DAILY_FORECAST);
    });

    it('should return widget config with data', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockWidgetConfig });

      const result = await widgetsApi.getWidget(WidgetType.MOON_PHASE);

      expect(result.data).toBeDefined();
      expect(result.data.primaryPersonId).toBe('person-789');
      expect(result.data.refreshInterval).toBe(3600);
    });

    it('should handle 404 when widget not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Widget not found' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(widgetsApi.getWidget(WidgetType.MOON_PHASE)).rejects.toEqual(mockError);
    });
  });

  describe('getWidgetData', () => {
    it('should get moon phase widget data', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoonPhaseData });

      const result = await widgetsApi.getWidgetData(WidgetType.MOON_PHASE);

      expect(apiClient.get).toHaveBeenCalledWith('/widgets/moon_phase/data');
      expect(result).toEqual(mockMoonPhaseData);
    });

    it('should return moon phase details', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMoonPhaseData });

      const result = await widgetsApi.getWidgetData(WidgetType.MOON_PHASE);

      expect(result.phase).toBe('Waxing Gibbous');
      expect(result.illumination).toBe(0.78);
      expect(result.age).toBe(10.5);
      expect(result.zodiacSign).toBe('Sagittarius');
    });

    it('should get star message widget data', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockStarMessageData });

      const result = await widgetsApi.getWidgetData(WidgetType.STAR_MESSAGE);

      expect(apiClient.get).toHaveBeenCalledWith('/widgets/star_message/data');
      expect(result).toEqual(mockStarMessageData);
    });

    it('should return star message content', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockStarMessageData });

      const result = await widgetsApi.getWidgetData(WidgetType.STAR_MESSAGE);

      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe('string');
      expect(result.category).toBe('wisdom');
    });

    it('should get today summary widget data', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummaryData });

      const result = await widgetsApi.getWidgetData(WidgetType.TODAY_SUMMARY);

      expect(apiClient.get).toHaveBeenCalledWith('/widgets/today_summary/data');
      expect(result).toEqual(mockTodaySummaryData);
    });

    it('should return today summary with scores', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTodaySummaryData });

      const result = await widgetsApi.getWidgetData(WidgetType.TODAY_SUMMARY);

      expect(result.overallScore).toBe(8.5);
      expect(result.highlights).toBeDefined();
      expect(Array.isArray(result.highlights)).toBe(true);
    });

    it('should get daily forecast widget data', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecastData });

      const result = await widgetsApi.getWidgetData(WidgetType.DAILY_FORECAST);

      expect(apiClient.get).toHaveBeenCalledWith('/widgets/daily_forecast/data');
      expect(result).toEqual(mockDailyForecastData);
    });

    it('should return daily forecast with scores', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDailyForecastData });

      const result = await widgetsApi.getWidgetData(WidgetType.DAILY_FORECAST);

      expect(result.loveScore).toBe(7.5);
      expect(result.careerScore).toBe(8.5);
      expect(result.healthScore).toBe(6.5);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch widget data');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(
        widgetsApi.getWidgetData(WidgetType.MOON_PHASE),
      ).rejects.toThrow('Failed to fetch widget data');
    });
  });

  describe('createOrUpdateWidget', () => {
    it('should create new widget', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockWidgetConfig });

      const widgetData = {
        primaryPersonId: 'person-789',
        refreshInterval: 3600,
        theme: 'dark',
      };

      const result = await widgetsApi.createOrUpdateWidget(
        WidgetType.MOON_PHASE,
        widgetData,
      );

      expect(apiClient.post).toHaveBeenCalledWith('/widgets/moon_phase', { data: widgetData });
      expect(result).toEqual(mockWidgetConfig);
    });

    it('should update existing widget', async () => {
      const updatedWidget = {
        ...mockWidgetConfig,
        data: {
          ...mockWidgetConfig.data,
          refreshInterval: 1800,
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: updatedWidget });

      const result = await widgetsApi.createOrUpdateWidget(WidgetType.MOON_PHASE, {
        refreshInterval: 1800,
      });

      expect(result.data.refreshInterval).toBe(1800);
    });

    it('should create widget with custom theme', async () => {
      const customWidget = {
        ...mockWidgetConfig,
        data: {
          ...mockWidgetConfig.data,
          theme: 'light',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: customWidget });

      const result = await widgetsApi.createOrUpdateWidget(WidgetType.MOON_PHASE, {
        theme: 'light',
      });

      expect(result.data.theme).toBe('light');
    });

    it('should create widget with custom size', async () => {
      const customWidget = {
        ...mockWidgetConfig,
        data: {
          ...mockWidgetConfig.data,
          size: 'large',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: customWidget });

      const result = await widgetsApi.createOrUpdateWidget(WidgetType.MOON_PHASE, {
        size: 'large',
      });

      expect(result.data.size).toBe('large');
    });

    it('should create widget with customization options', async () => {
      const customWidget = {
        ...mockWidgetConfig,
        data: {
          ...mockWidgetConfig.data,
          customization: {
            showPhaseDetails: false,
            showTransitionDates: true,
            showZodiacSign: true,
          },
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: customWidget });

      const result = await widgetsApi.createOrUpdateWidget(WidgetType.MOON_PHASE, {
        customization: {
          showPhaseDetails: false,
          showTransitionDates: true,
          showZodiacSign: true,
        },
      });

      expect(result.data.customization.showZodiacSign).toBe(true);
    });

    it('should handle different widget types', async () => {
      const widgetTypes = [
        WidgetType.MOON_PHASE,
        WidgetType.STAR_MESSAGE,
        WidgetType.TODAY_SUMMARY,
        WidgetType.DAILY_FORECAST,
      ];

      for (const widgetType of widgetTypes) {
        const widget = { ...mockWidgetConfig, widgetType };
        (apiClient.post as jest.Mock).mockResolvedValue({ data: widget });

        await widgetsApi.createOrUpdateWidget(widgetType, {});

        expect(apiClient.post).toHaveBeenCalledWith(`/widgets/${widgetType}`, { data: {} });
      }
    });

    it('should return widget config with timestamps', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockWidgetConfig });

      const result = await widgetsApi.createOrUpdateWidget(WidgetType.MOON_PHASE, {});

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should handle validation errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid widget configuration' },
        },
      };
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        widgetsApi.createOrUpdateWidget(WidgetType.MOON_PHASE, {}),
      ).rejects.toEqual(mockError);
    });
  });

  describe('toggleWidget', () => {
    it('should enable widget', async () => {
      const enabledWidget = { ...mockWidgetConfig, isEnabled: true };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: enabledWidget });

      const result = await widgetsApi.toggleWidget(WidgetType.MOON_PHASE, true);

      expect(apiClient.put).toHaveBeenCalledWith('/widgets/moon_phase/toggle', {
        isEnabled: true,
      });
      expect(result.isEnabled).toBe(true);
    });

    it('should disable widget', async () => {
      const disabledWidget = { ...mockWidgetConfig, isEnabled: false };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: disabledWidget });

      const result = await widgetsApi.toggleWidget(WidgetType.MOON_PHASE, false);

      expect(apiClient.put).toHaveBeenCalledWith('/widgets/moon_phase/toggle', {
        isEnabled: false,
      });
      expect(result.isEnabled).toBe(false);
    });

    it('should toggle different widget types', async () => {
      const widgetTypes = [
        WidgetType.MOON_PHASE,
        WidgetType.STAR_MESSAGE,
        WidgetType.TODAY_SUMMARY,
        WidgetType.DAILY_FORECAST,
      ];

      for (const widgetType of widgetTypes) {
        const widget = { ...mockWidgetConfig, widgetType, isEnabled: false };
        (apiClient.put as jest.Mock).mockResolvedValue({ data: widget });

        const result = await widgetsApi.toggleWidget(widgetType, false);

        expect(result.widgetType).toBe(widgetType);
        expect(result.isEnabled).toBe(false);
      }
    });

    it('should return updated widget config', async () => {
      (apiClient.put as jest.Mock).mockResolvedValue({ data: mockWidgetConfig });

      const result = await widgetsApi.toggleWidget(WidgetType.MOON_PHASE, true);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('widgetType');
      expect(result).toHaveProperty('isEnabled');
    });

    it('should handle 404 when widget not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Widget not found' },
        },
      };
      (apiClient.put as jest.Mock).mockRejectedValue(mockError);

      await expect(
        widgetsApi.toggleWidget(WidgetType.MOON_PHASE, true),
      ).rejects.toEqual(mockError);
    });
  });

  describe('deleteWidget', () => {
    it('should delete widget by type', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});

      await widgetsApi.deleteWidget(WidgetType.MOON_PHASE);

      expect(apiClient.delete).toHaveBeenCalledWith('/widgets/moon_phase');
    });

    it('should not return data on successful deletion', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});

      const result = await widgetsApi.deleteWidget(WidgetType.MOON_PHASE);

      expect(result).toBeUndefined();
    });

    it('should delete different widget types', async () => {
      const widgetTypes = [
        WidgetType.MOON_PHASE,
        WidgetType.STAR_MESSAGE,
        WidgetType.TODAY_SUMMARY,
        WidgetType.DAILY_FORECAST,
      ];

      (apiClient.delete as jest.Mock).mockResolvedValue({});

      for (const widgetType of widgetTypes) {
        await widgetsApi.deleteWidget(widgetType);

        expect(apiClient.delete).toHaveBeenCalledWith(`/widgets/${widgetType}`);
      }
    });

    it('should handle 404 when widget not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Widget not found' },
        },
      };
      (apiClient.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(widgetsApi.deleteWidget(WidgetType.MOON_PHASE)).rejects.toEqual(
        mockError,
      );
    });

    it('should handle 403 forbidden errors', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { message: 'Forbidden' },
        },
      };
      (apiClient.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(widgetsApi.deleteWidget(WidgetType.MOON_PHASE)).rejects.toEqual(
        mockError,
      );
    });
  });

  describe('widget types', () => {
    it('should have correct widget type values', () => {
      expect(WidgetType.MOON_PHASE).toBe('moon_phase');
      expect(WidgetType.STAR_MESSAGE).toBe('star_message');
      expect(WidgetType.TODAY_SUMMARY).toBe('today_summary');
      expect(WidgetType.DAILY_FORECAST).toBe('daily_forecast');
    });

    it('should support all widget type enums', () => {
      const types = Object.values(WidgetType);

      expect(types).toContain('moon_phase');
      expect(types).toContain('star_message');
      expect(types).toContain('today_summary');
      expect(types).toContain('daily_forecast');
    });
  });

  describe('widget config structure', () => {
    it('should have widget data with optional fields', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockWidgetConfig });

      const result = await widgetsApi.getWidget(WidgetType.MOON_PHASE);

      expect(result.data.primaryPersonId).toBeDefined();
      expect(result.data.refreshInterval).toBeDefined();
      expect(result.data.theme).toBeDefined();
      expect(result.data.size).toBeDefined();
    });

    it('should handle minimal widget config', async () => {
      const minimalWidget: WidgetConfig = {
        id: 'widget-min',
        userId: 'user-123',
        widgetType: WidgetType.STAR_MESSAGE,
        data: {},
        isEnabled: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: minimalWidget });

      const result = await widgetsApi.getWidget(WidgetType.STAR_MESSAGE);

      expect(result.data).toEqual({});
    });
  });
});
