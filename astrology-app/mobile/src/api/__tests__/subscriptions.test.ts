import { subscriptionsApi, SubscriptionUsage } from '../subscriptions';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('subscriptionsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsage', () => {
    it('should fetch subscription usage for basic plan', async () => {
      const mockUsage: SubscriptionUsage = {
        plan: 'basic',
        dailyActionLimit: 2,
        unlimitedActions: false,
        profileLimit: 3,
        actionsUsedToday: 1,
        actionsRemaining: 1,
        profilesUsed: 2,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUsage });

      const result = await subscriptionsApi.getUsage();

      expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/usage');
      expect(result).toEqual(mockUsage);
      expect(result.plan).toBe('basic');
      expect(result.actionsRemaining).toBe(1);
    });

    it('should fetch subscription usage for standard plan', async () => {
      const mockUsage: SubscriptionUsage = {
        plan: 'standard',
        dailyActionLimit: 4,
        unlimitedActions: false,
        profileLimit: 10,
        actionsUsedToday: 3,
        actionsRemaining: 1,
        profilesUsed: 5,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUsage });

      const result = await subscriptionsApi.getUsage();

      expect(result).toEqual(mockUsage);
      expect(result.plan).toBe('standard');
      expect(result.dailyActionLimit).toBe(4);
    });

    it('should fetch subscription usage for premium plan with unlimited actions', async () => {
      const mockUsage: SubscriptionUsage = {
        plan: 'premium',
        dailyActionLimit: -1,
        unlimitedActions: true,
        profileLimit: 50,
        actionsUsedToday: 25,
        actionsRemaining: null,
        profilesUsed: 15,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUsage });

      const result = await subscriptionsApi.getUsage();

      expect(result).toEqual(mockUsage);
      expect(result.unlimitedActions).toBe(true);
      expect(result.actionsRemaining).toBeNull();
    });

    it('should handle no actions remaining', async () => {
      const mockUsage: SubscriptionUsage = {
        plan: 'basic',
        dailyActionLimit: 2,
        unlimitedActions: false,
        profileLimit: 3,
        actionsUsedToday: 2,
        actionsRemaining: 0,
        profilesUsed: 1,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUsage });

      const result = await subscriptionsApi.getUsage();

      expect(result.actionsRemaining).toBe(0);
      expect(result.actionsUsedToday).toBe(result.dailyActionLimit);
    });

    it('should handle errors when fetching usage', async () => {
      const mockError = new Error('Unauthorized');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(subscriptionsApi.getUsage()).rejects.toThrow('Unauthorized');
    });

    it('should handle profile limit exceeded scenario', async () => {
      const mockUsage: SubscriptionUsage = {
        plan: 'basic',
        dailyActionLimit: 2,
        unlimitedActions: false,
        profileLimit: 3,
        actionsUsedToday: 0,
        actionsRemaining: 2,
        profilesUsed: 3,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockUsage });

      const result = await subscriptionsApi.getUsage();

      expect(result.profilesUsed).toBe(result.profileLimit);
    });
  });
});
