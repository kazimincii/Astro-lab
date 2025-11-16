// Stripe configuration
// Make sure to set these environment variables in your .env file

export const STRIPE_CONFIG = {
  // Test publishable key (replace with your actual key)
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here',

  // Merchant details
  merchantIdentifier: 'merchant.com.astrology.app',

  // URL scheme for redirects
  urlScheme: 'astrology',
};

// Plan IDs mapping (should match backend configuration)
export const STRIPE_PLAN_IDS = {
  basic: {
    monthly: 'price_basic_monthly',
    yearly: 'price_basic_yearly',
  },
  standard: {
    monthly: 'price_standard_monthly',
    yearly: 'price_standard_yearly',
  },
  premium: {
    monthly: 'price_premium_monthly',
    yearly: 'price_premium_yearly',
  },
};

// Plan pricing (in USD)
export const PLAN_PRICING = {
  basic: {
    monthly: 0,
    yearly: 0,
  },
  standard: {
    monthly: 10,
    yearly: 100, // ~$8.33/month
  },
  premium: {
    monthly: 19,
    yearly: 180, // ~$15/month
  },
};
