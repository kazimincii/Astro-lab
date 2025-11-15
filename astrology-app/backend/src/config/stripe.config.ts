import { registerAs } from '@nestjs/config';

export const stripeConfig = registerAs('stripe', () => ({
  apiKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',

  // Price IDs from Stripe Dashboard
  prices: {
    standard: {
      monthly: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID || 'price_standard_monthly',
      yearly: process.env.STRIPE_STANDARD_YEARLY_PRICE_ID || 'price_standard_yearly',
    },
    premium: {
      monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_premium_monthly',
      yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_premium_yearly',
    },
  },

  // Product IDs from Stripe Dashboard
  products: {
    standard: process.env.STRIPE_STANDARD_PRODUCT_ID || 'prod_standard',
    premium: process.env.STRIPE_PREMIUM_PRODUCT_ID || 'prod_premium',
  },
}));
