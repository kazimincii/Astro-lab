import { SubscriptionPlan } from '@/entities/subscription.entity';

export type BillingCycle = 'monthly' | 'yearly';

export interface PlanDefinition {
  key: SubscriptionPlan;
  label: string;
  description: string;
  trialEligible: boolean;
  features: string[];
  dailyActionLimit: number;
  profileLimit: number;
  unlimitedActions: boolean;
  prices: Record<BillingCycle, number>;
  stripePriceIds: Record<BillingCycle, string | null>;
}

const priceId = (envKey: string) => process.env[envKey] || null;

export const PLAN_DEFINITIONS: Record<SubscriptionPlan, PlanDefinition> = {
  [SubscriptionPlan.BASIC]: {
    key: SubscriptionPlan.BASIC,
    label: 'Basic',
    description: 'Free tier with limited premium actions and profiles.',
    trialEligible: false,
    features: ['2 premium actions per day', '2 profiles', 'Short interpretations & previews'],
    dailyActionLimit: 2,
    profileLimit: 2,
    unlimitedActions: false,
    prices: { monthly: 0, yearly: 0 },
    stripePriceIds: {
      monthly: priceId('STRIPE_PRICE_BASIC_MONTHLY'),
      yearly: priceId('STRIPE_PRICE_BASIC_YEARLY'),
    },
  },
  [SubscriptionPlan.STANDARD]: {
    key: SubscriptionPlan.STANDARD,
    label: 'Standard',
    description: 'More daily actions, more profiles, deeper insights.',
    trialEligible: true,
    features: [
      '4 premium actions per day',
      'Up to 10 profiles',
      'Full daily/weekly forecasts',
      'AI Ask the Stars access',
    ],
    dailyActionLimit: 4,
    profileLimit: 10,
    unlimitedActions: false,
    prices: { monthly: 10, yearly: 99 },
    stripePriceIds: {
      monthly: priceId('STRIPE_PRICE_STANDARD_MONTHLY'),
      yearly: priceId('STRIPE_PRICE_STANDARD_YEARLY'),
    },
  },
  [SubscriptionPlan.PREMIUM]: {
    key: SubscriptionPlan.PREMIUM,
    label: 'Premium',
    description: 'Unlimited premium actions and advanced compatibility.',
    trialEligible: true,
    features: [
      'Unlimited premium actions',
      '50+ profiles',
      'Advanced compatibility & rituals',
      'Tarot, coffee, numerology deep dives',
    ],
    dailyActionLimit: 999,
    profileLimit: 50,
    unlimitedActions: true,
    prices: { monthly: 19, yearly: 189 },
    stripePriceIds: {
      monthly: priceId('STRIPE_PRICE_PREMIUM_MONTHLY'),
      yearly: priceId('STRIPE_PRICE_PREMIUM_YEARLY'),
    },
  },
};

export const TRIAL_DAYS = 7;

export const BILLING_CYCLES: BillingCycle[] = ['monthly', 'yearly'];

export function getPlanDefinition(plan: SubscriptionPlan): PlanDefinition {
  return PLAN_DEFINITIONS[plan];
}

export function isPaidPlan(plan: SubscriptionPlan) {
  return plan !== SubscriptionPlan.BASIC;
}
