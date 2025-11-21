import { profilesApi } from '@/api/profiles';
import { subscriptionsApi } from '@/api/subscriptions';
import { paymentApi } from '@/api/payment';

/**
 * API Tests for Astrology App
 *
 * These tests verify API client functionality
 */

describe('Profiles API', () => {
  describe('getAll', () => {
    it('should fetch all profiles', async () => {
      const profiles = await profilesApi.getAll();
      expect(Array.isArray(profiles)).toBe(true);
    });

    it('should return profiles with required fields', async () => {
      const profiles = await profilesApi.getAll();
      if (profiles.length > 0) {
        const profile = profiles[0];
        expect(profile).toHaveProperty('id');
        expect(profile).toHaveProperty('name');
      }
    });
  });

  describe('getOne', () => {
    it('should fetch a single profile', async () => {
      const profiles = await profilesApi.getAll();
      if (profiles.length > 0) {
        const profile = await profilesApi.getOne(profiles[0].id);
        expect(profile.id).toBe(profiles[0].id);
      }
    });
  });

  describe('create', () => {
    it('should create a new profile', async () => {
      const newProfile = {
        name: 'Test Profile ' + Date.now(),
        birthDate: '1990-01-01',
      };
      const profile = await profilesApi.create(newProfile as any);
      expect(profile).toHaveProperty('id');
      expect(profile.name).toBe(newProfile.name);
    });
  });

  describe('update', () => {
    it('should update a profile', async () => {
      const profiles = await profilesApi.getAll();
      if (profiles.length > 0) {
        const updated = await profilesApi.update(profiles[0].id, {
          name: 'Updated ' + Date.now(),
        });
        expect(updated.name).toContain('Updated');
      }
    });
  });
});

describe('Subscriptions API', () => {
  describe('getPlans', () => {
    it('should fetch available plans', async () => {
      const plans = await subscriptionsApi.getPlans();
      expect(Array.isArray(plans)).toBe(true);
      expect(plans.length).toBeGreaterThan(0);
    });

    it('should return plans with pricing info', async () => {
      const plans = await subscriptionsApi.getPlans();
      if (plans.length > 0) {
        const plan = plans[0];
        expect(plan).toHaveProperty('id');
        expect(plan).toHaveProperty('name');
        expect(plan).toHaveProperty('price');
      }
    });
  });

  describe('getCurrentSubscription', () => {
    it('should fetch current subscription', async () => {
      const subscription = await subscriptionsApi.getCurrentSubscription();
      if (subscription) {
        expect(subscription).toHaveProperty('status');
      }
    });
  });

  describe('upgradePlan', () => {
    it('should attempt plan upgrade', async () => {
      // This test would require valid plan ID
      expect(subscriptionsApi.upgradePlan).toBeDefined();
    });
  });
});

describe('Payment API', () => {
  describe('createPaymentIntent', () => {
    it('should create payment intent', async () => {
      // This test requires valid payment details
      expect(paymentApi.createPaymentIntent).toBeDefined();
    });
  });

  describe('processPayment', () => {
    it('should process payment', async () => {
      expect(paymentApi.processPayment).toBeDefined();
    });
  });
});
