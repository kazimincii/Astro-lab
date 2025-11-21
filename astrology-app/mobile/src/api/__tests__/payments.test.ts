import { paymentsApi } from '../payments';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('paymentsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlans', () => {
    it('should fetch subscription plans', async () => {
      const mockPlans = [
        { id: '1', type: 'standard', price: 10 },
        { id: '2', type: 'premium', price: 19 },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPlans });

      const result = await paymentsApi.getPlans();

      expect(apiClient.get).toHaveBeenCalledWith('/payments/plans');
      expect(result).toEqual(mockPlans);
    });

    it('should handle errors when fetching plans', async () => {
      const mockError = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(paymentsApi.getPlans()).rejects.toThrow('Network error');
    });
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent', async () => {
      const mockIntent = {
        clientSecret: 'pi_secret_123',
        paymentIntentId: 'pi_123',
        amount: 1000,
        currency: 'usd',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockIntent });

      const result = await paymentsApi.createPaymentIntent('standard_monthly');

      expect(apiClient.post).toHaveBeenCalledWith('/payments/create-intent', {
        planId: 'standard_monthly',
      });
      expect(result).toEqual(mockIntent);
    });
  });

  describe('createSubscription', () => {
    it('should create subscription with payment method', async () => {
      const mockSubscription = {
        subscriptionId: 'sub_123',
        clientSecret: 'secret_123',
        status: 'active',
      };

      const subscriptionData = {
        planType: 'standard' as const,
        paymentMethodId: 'pm_123',
        billingCycle: 'monthly' as const,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSubscription });

      const result = await paymentsApi.createSubscription(subscriptionData);

      expect(apiClient.post).toHaveBeenCalledWith('/payments/subscriptions', subscriptionData);
      expect(result).toEqual(mockSubscription);
    });
  });

  describe('getSubscriptionStatus', () => {
    it('should fetch current subscription status', async () => {
      const mockStatus = {
        id: 'sub_123',
        planType: 'premium' as const,
        status: 'active' as const,
        currentPeriodEnd: '2024-12-31',
        cancelAtPeriodEnd: false,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockStatus });

      const result = await paymentsApi.getSubscriptionStatus();

      expect(apiClient.get).toHaveBeenCalledWith('/payments/subscription/status');
      expect(result).toEqual(mockStatus);
    });

    it('should return null when no subscription exists', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: null });

      const result = await paymentsApi.getSubscriptionStatus();

      expect(result).toBeNull();
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription at period end', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({});

      await paymentsApi.cancelSubscription();

      expect(apiClient.post).toHaveBeenCalledWith('/payments/subscription/cancel');
    });
  });

  describe('resumeSubscription', () => {
    it('should resume a canceled subscription', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({});

      await paymentsApi.resumeSubscription();

      expect(apiClient.post).toHaveBeenCalledWith('/payments/subscription/resume');
    });
  });

  describe('updateSubscription', () => {
    it('should update subscription plan', async () => {
      const mockUpdated = {
        id: 'sub_123',
        planType: 'premium' as const,
        status: 'active' as const,
        currentPeriodEnd: '2024-12-31',
        cancelAtPeriodEnd: false,
      };

      const updateData = {
        planType: 'premium' as const,
        billingCycle: 'yearly' as const,
      };

      (apiClient.put as jest.Mock).mockResolvedValue({ data: mockUpdated });

      const result = await paymentsApi.updateSubscription(updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/payments/subscription', updateData);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('getPaymentMethods', () => {
    it('should fetch payment methods', async () => {
      const mockMethods = [
        { id: 'pm_1', type: 'card', last4: '4242' },
        { id: 'pm_2', type: 'card', last4: '5555' },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMethods });

      const result = await paymentsApi.getPaymentMethods();

      expect(apiClient.get).toHaveBeenCalledWith('/payments/payment-methods');
      expect(result).toEqual(mockMethods);
    });
  });

  describe('setDefaultPaymentMethod', () => {
    it('should set default payment method', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({});

      await paymentsApi.setDefaultPaymentMethod('pm_123');

      expect(apiClient.post).toHaveBeenCalledWith('/payments/payment-methods/default', {
        paymentMethodId: 'pm_123',
      });
    });
  });
});
