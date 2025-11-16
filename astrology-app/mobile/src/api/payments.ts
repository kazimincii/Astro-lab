import { apiClient } from './client';

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface SubscriptionPlan {
  id: string;
  type: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  clientSecret: string;
  status: string;
}

export interface SubscriptionStatus {
  id: string;
  planType: 'basic' | 'standard' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export const paymentsApi = {
  /**
   * Get available subscription plans
   */
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get('/payments/plans');
    return response.data;
  },

  /**
   * Create a payment intent for subscription
   */
  createPaymentIntent: async (planId: string): Promise<PaymentIntent> => {
    const response = await apiClient.post('/payments/create-intent', { planId });
    return response.data;
  },

  /**
   * Create a subscription
   */
  createSubscription: async (data: {
    planType: 'basic' | 'standard' | 'premium';
    paymentMethodId: string;
    billingCycle: 'monthly' | 'yearly';
  }): Promise<CreateSubscriptionResponse> => {
    const response = await apiClient.post('/payments/subscriptions', data);
    return response.data;
  },

  /**
   * Get current subscription status
   */
  getSubscriptionStatus: async (): Promise<SubscriptionStatus | null> => {
    const response = await apiClient.get('/payments/subscription/status');
    return response.data;
  },

  /**
   * Cancel subscription at period end
   */
  cancelSubscription: async (): Promise<void> => {
    await apiClient.post('/payments/subscription/cancel');
  },

  /**
   * Resume a canceled subscription
   */
  resumeSubscription: async (): Promise<void> => {
    await apiClient.post('/payments/subscription/resume');
  },

  /**
   * Update subscription plan
   */
  updateSubscription: async (data: {
    planType: 'basic' | 'standard' | 'premium';
    billingCycle: 'monthly' | 'yearly';
  }): Promise<SubscriptionStatus> => {
    const response = await apiClient.put('/payments/subscription', data);
    return response.data;
  },

  /**
   * Get payment methods
   */
  getPaymentMethods: async (): Promise<any[]> => {
    const response = await apiClient.get('/payments/payment-methods');
    return response.data;
  },

  /**
   * Set default payment method
   */
  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<void> => {
    await apiClient.post('/payments/payment-methods/default', { paymentMethodId });
  },
};
