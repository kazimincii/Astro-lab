import { trialsApi, Trial } from '../trials';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('trialsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTrial: Trial = {
    id: 'trial_123',
    userId: 'user_456',
    planType: 'standard',
    startDate: '2024-11-10T00:00:00Z',
    endDate: '2024-11-24T00:00:00Z',
    status: 'active',
  };

  describe('startTrial', () => {
    it('should start a standard trial successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockTrial });

      const result = await trialsApi.startTrial('standard');

      expect(apiClient.post).toHaveBeenCalledWith('/trials/start', {
        planType: 'standard',
      });
      expect(result).toEqual(mockTrial);
      expect(result.planType).toBe('standard');
    });

    it('should start a premium trial successfully', async () => {
      const premiumTrial: Trial = {
        ...mockTrial,
        id: 'trial_789',
        planType: 'premium',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: premiumTrial });

      const result = await trialsApi.startTrial('premium');

      expect(apiClient.post).toHaveBeenCalledWith('/trials/start', {
        planType: 'premium',
      });
      expect(result.planType).toBe('premium');
    });

    it('should handle trial already exists error', async () => {
      const mockError = new Error('Trial already active');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(trialsApi.startTrial('standard')).rejects.toThrow(
        'Trial already active'
      );
    });

    it('should handle trial already used error', async () => {
      const mockError = new Error('Trial already used for this plan');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(trialsApi.startTrial('premium')).rejects.toThrow(
        'Trial already used for this plan'
      );
    });

    it('should handle user already has subscription error', async () => {
      const mockError = new Error('Cannot start trial with active subscription');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(trialsApi.startTrial('standard')).rejects.toThrow(
        'Cannot start trial with active subscription'
      );
    });
  });

  describe('getActiveTrial', () => {
    it('should fetch active trial when one exists', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTrial });

      const result = await trialsApi.getActiveTrial();

      expect(apiClient.get).toHaveBeenCalledWith('/trials/active');
      expect(result).toEqual(mockTrial);
      expect(result?.status).toBe('active');
    });

    it('should return null when no active trial exists', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: null });

      const result = await trialsApi.getActiveTrial();

      expect(result).toBeNull();
    });

    it('should fetch premium trial', async () => {
      const premiumTrial: Trial = {
        ...mockTrial,
        planType: 'premium',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: premiumTrial });

      const result = await trialsApi.getActiveTrial();

      expect(result?.planType).toBe('premium');
    });

    it('should handle errors when fetching active trial', async () => {
      const mockError = new Error('Server error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(trialsApi.getActiveTrial()).rejects.toThrow('Server error');
    });
  });

  describe('cancelTrial', () => {
    it('should cancel trial successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: {} });

      await trialsApi.cancelTrial();

      expect(apiClient.post).toHaveBeenCalledWith('/trials/cancel');
    });

    it('should handle no active trial error', async () => {
      const mockError = new Error('No active trial to cancel');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(trialsApi.cancelTrial()).rejects.toThrow('No active trial to cancel');
    });

    it('should handle trial already cancelled error', async () => {
      const mockError = new Error('Trial already cancelled');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(trialsApi.cancelTrial()).rejects.toThrow('Trial already cancelled');
    });

    it('should handle unauthorized cancellation', async () => {
      const mockError = new Error('Unauthorized');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(trialsApi.cancelTrial()).rejects.toThrow('Unauthorized');
    });
  });

  describe('Trial lifecycle', () => {
    it('should handle full trial flow: start -> get -> cancel', async () => {
      // Start trial
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockTrial });
      const startResult = await trialsApi.startTrial('standard');
      expect(startResult.status).toBe('active');

      // Get active trial
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTrial });
      const getResult = await trialsApi.getActiveTrial();
      expect(getResult).toEqual(mockTrial);

      // Cancel trial
      (apiClient.post as jest.Mock).mockResolvedValue({ data: {} });
      await trialsApi.cancelTrial();
      expect(apiClient.post).toHaveBeenCalledWith('/trials/cancel');

      // Verify no active trial after cancellation
      (apiClient.get as jest.Mock).mockResolvedValue({ data: null });
      const finalResult = await trialsApi.getActiveTrial();
      expect(finalResult).toBeNull();
    });
  });
});
