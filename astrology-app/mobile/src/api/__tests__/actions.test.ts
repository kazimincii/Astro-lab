import { actionsApi, ActionsData, EffectivePlan } from '../actions';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('actionsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRemainingActions', () => {
    it('should fetch remaining actions for basic plan', async () => {
      const mockActionsData: ActionsData = {
        dailyLimit: 2,
        used: 1,
        remaining: 1,
        planType: 'basic',
        resetsAt: '2024-11-17T00:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockActionsData });

      const result = await actionsApi.getRemainingActions();

      expect(apiClient.get).toHaveBeenCalledWith('/actions/remaining');
      expect(result).toEqual(mockActionsData);
      expect(result.remaining).toBe(1);
    });

    it('should fetch remaining actions when none used', async () => {
      const mockActionsData: ActionsData = {
        dailyLimit: 4,
        used: 0,
        remaining: 4,
        planType: 'standard',
        resetsAt: '2024-11-17T00:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockActionsData });

      const result = await actionsApi.getRemainingActions();

      expect(result.used).toBe(0);
      expect(result.remaining).toBe(result.dailyLimit);
    });

    it('should fetch unlimited actions for premium plan', async () => {
      const mockActionsData: ActionsData = {
        dailyLimit: -1,
        used: 50,
        remaining: -1,
        planType: 'premium',
        resetsAt: '2024-11-17T00:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockActionsData });

      const result = await actionsApi.getRemainingActions();

      expect(result.dailyLimit).toBe(-1);
      expect(result.remaining).toBe(-1);
    });

    it('should handle no remaining actions', async () => {
      const mockActionsData: ActionsData = {
        dailyLimit: 2,
        used: 2,
        remaining: 0,
        planType: 'basic',
        resetsAt: '2024-11-17T00:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockActionsData });

      const result = await actionsApi.getRemainingActions();

      expect(result.remaining).toBe(0);
    });

    it('should handle errors when fetching actions', async () => {
      const mockError = new Error('Server error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(actionsApi.getRemainingActions()).rejects.toThrow('Server error');
    });
  });

  describe('getEffectivePlan', () => {
    it('should fetch effective plan from active subscription', async () => {
      const mockPlan: EffectivePlan = {
        planType: 'standard',
        source: 'subscription',
        dailyActionLimit: 4,
        maxProfiles: 10,
        features: ['Advanced charts', 'Daily forecasts', 'Priority support'],
        subscription: {
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2025-01-01T00:00:00Z',
          status: 'active',
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPlan });

      const result = await actionsApi.getEffectivePlan();

      expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/effective-plan');
      expect(result).toEqual(mockPlan);
      expect(result.source).toBe('subscription');
    });

    it('should fetch effective plan from active trial', async () => {
      const mockPlan: EffectivePlan = {
        planType: 'premium',
        source: 'trial',
        dailyActionLimit: -1,
        maxProfiles: 50,
        features: [
          'Unlimited actions',
          'All premium features',
          'Pro mode',
          'Priority support',
        ],
        trial: {
          startDate: '2024-11-10T00:00:00Z',
          endDate: '2024-11-24T00:00:00Z',
          daysRemaining: 8,
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPlan });

      const result = await actionsApi.getEffectivePlan();

      expect(result.source).toBe('trial');
      expect(result.trial?.daysRemaining).toBe(8);
    });

    it('should fetch default basic plan when no subscription or trial', async () => {
      const mockPlan: EffectivePlan = {
        planType: 'basic',
        source: 'default',
        dailyActionLimit: 2,
        maxProfiles: 3,
        features: ['Basic features', 'Limited actions'],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPlan });

      const result = await actionsApi.getEffectivePlan();

      expect(result.source).toBe('default');
      expect(result.planType).toBe('basic');
    });

    it('should handle trial with 1 day remaining', async () => {
      const mockPlan: EffectivePlan = {
        planType: 'standard',
        source: 'trial',
        dailyActionLimit: 4,
        maxProfiles: 10,
        features: ['Advanced features'],
        trial: {
          startDate: '2024-11-09T00:00:00Z',
          endDate: '2024-11-17T00:00:00Z',
          daysRemaining: 1,
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPlan });

      const result = await actionsApi.getEffectivePlan();

      expect(result.trial?.daysRemaining).toBe(1);
    });

    it('should handle errors when fetching effective plan', async () => {
      const mockError = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(actionsApi.getEffectivePlan()).rejects.toThrow('Network error');
    });
  });
});
