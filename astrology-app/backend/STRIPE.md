# Stripe Payment Integration

This document explains the Stripe payment integration for subscription management in the Astrology Super-App.

## Overview

The app uses Stripe for:
- **Subscription Management**: Handle recurring payments for Standard and Premium plans
- **Payment Processing**: Secure credit card processing via Stripe Checkout
- **Customer Portal**: Allow users to manage their subscriptions
- **Webhook Handling**: Automatic subscription updates based on payment events

## Setup

### 1. Create Stripe Account

1. Sign up at [https://stripe.com](https://stripe.com)
2. Complete account verification
3. Get your API keys from the Dashboard

### 2. Environment Variables

Add these to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Product IDs (from Stripe Dashboard)
STRIPE_STANDARD_PRODUCT_ID=prod_...
STRIPE_PREMIUM_PRODUCT_ID=prod_...

# Price IDs (from Stripe Dashboard)
STRIPE_STANDARD_MONTHLY_PRICE_ID=price_...
STRIPE_STANDARD_YEARLY_PRICE_ID=price_...
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_...
```

### 3. Create Products in Stripe Dashboard

#### Standard Plan
```
Name: Astrology Standard Plan
Description: 10 birth charts, 4 premium actions per day
```

**Pricing:**
- Monthly: $10/month
- Yearly: $100/year ($8.33/month - 17% discount)

#### Premium Plan
```
Name: Astrology Premium Plan
Description: 50 birth charts, unlimited premium actions, priority support
```

**Pricing:**
- Monthly: $19/month
- Yearly: $190/year ($15.83/month - 17% discount)

### 4. Setup Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/v1/payments/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## API Endpoints

### Create Checkout Session

Create a Stripe Checkout session for subscribing to a plan.

**Endpoint:** `POST /api/v1/payments/checkout`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "planType": "standard",
  "billingPeriod": "monthly",
  "successUrl": "https://your-app.com/subscription/success",
  "cancelUrl": "https://your-app.com/subscription/cancel"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Usage:**
```typescript
const response = await fetch('/api/v1/payments/checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    planType: 'standard',
    billingPeriod: 'monthly',
    successUrl: 'myapp://subscription/success',
    cancelUrl: 'myapp://subscription/cancel',
  }),
});

const { url } = await response.json();
// Redirect user to checkout URL
window.location.href = url;
```

### Create Portal Session

Create a Stripe Customer Portal session for managing subscription.

**Endpoint:** `POST /api/v1/payments/portal`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "returnUrl": "https://your-app.com/settings"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

### Cancel Subscription

Cancel the active subscription.

**Endpoint:** `DELETE /api/v1/payments/subscription`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** `204 No Content`

### Get Upcoming Invoice

Get details about the next invoice.

**Endpoint:** `GET /api/v1/payments/upcoming-invoice`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "amountDue": 10.00,
  "currency": "usd",
  "periodStart": "2025-01-15T00:00:00.000Z",
  "periodEnd": "2025-02-15T00:00:00.000Z"
}
```

### Webhook Handler

Process Stripe webhook events.

**Endpoint:** `POST /api/v1/payments/webhook`

**Headers:**
```
stripe-signature: t=...,v1=...
Content-Type: application/json
```

**Note:** This endpoint is called automatically by Stripe. Do not call it manually.

## Integration Flow

### Subscription Purchase Flow

1. **User selects plan** in the mobile app
2. **App calls** `POST /payments/checkout` with plan details
3. **Backend creates** Stripe Checkout session
4. **User redirects** to Stripe Checkout page
5. **User completes** payment
6. **Stripe sends** `checkout.session.completed` webhook
7. **Stripe sends** `customer.subscription.created` webhook
8. **Backend creates** subscription in database
9. **User redirects** to success URL
10. **App shows** confirmation message

### Subscription Management Flow

1. **User clicks** "Manage Subscription" in settings
2. **App calls** `POST /payments/portal`
3. **Backend creates** Customer Portal session
4. **User redirects** to Stripe Customer Portal
5. **User updates** payment method, cancels, or upgrades
6. **Stripe sends** `customer.subscription.updated` webhook
7. **Backend updates** subscription in database
8. **User redirects** back to app

### Subscription Cancellation Flow

#### Option 1: Via Customer Portal
1. User manages subscription via portal
2. Stripe sends `customer.subscription.deleted` webhook
3. Backend marks subscription as cancelled

#### Option 2: Via API
1. **User clicks** "Cancel Subscription"
2. **App calls** `DELETE /payments/subscription`
3. **Backend calls** Stripe API to cancel
4. **Stripe sends** `customer.subscription.deleted` webhook
5. **Backend updates** subscription status

## Webhook Events

### checkout.session.completed
Fired when checkout is successful. Logs the event (subscription creation is handled by `customer.subscription.created`).

### customer.subscription.created
Fired when a new subscription is created. Creates subscription record in database.

**Handled Actions:**
- Cancel any existing active subscriptions
- Create new subscription with Stripe details
- Set status to 'active'

### customer.subscription.updated
Fired when subscription is modified (payment method, plan change, etc.).

**Handled Actions:**
- Update subscription status
- Update current period dates
- Set `cancelAtPeriodEnd` flag if applicable

### customer.subscription.deleted
Fired when subscription is cancelled.

**Handled Actions:**
- Set subscription status to 'cancelled'
- Record cancellation date

### invoice.payment_succeeded
Fired when a payment succeeds.

**Handled Actions:**
- Log successful payment
- Could send receipt email (implement if needed)

### invoice.payment_failed
Fired when a payment fails.

**Handled Actions:**
- Log failed payment
- Could send payment failure notification (implement if needed)

## Testing

### Test Mode

Use Stripe test mode during development:
- API keys start with `sk_test_` and `pk_test_`
- Use [test card numbers](https://stripe.com/docs/testing)

### Test Card Numbers

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**Payment Requires Authentication (3D Secure):**
```
Card: 4000 0027 6000 3184
```

**Declined Payment:**
```
Card: 4000 0000 0000 0002
```

### Testing Webhooks Locally

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/v1/payments/webhook
```

4. The CLI will display your webhook signing secret - add it to `.env`

5. Trigger test events:
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

## Security

### Webhook Signature Verification

All webhook requests are verified using the `stripe-signature` header:

```typescript
const event = stripe.webhooks.constructEvent(
  payload,
  signature,
  webhookSecret
);
```

This ensures webhooks are genuinely from Stripe and haven't been tampered with.

### API Key Security

- **Never** commit API keys to version control
- Use environment variables for all keys
- Rotate keys if compromised
- Use restricted API keys in production (limit permissions)

## Production Checklist

- [ ] Switch to live API keys (starting with `sk_live_`)
- [ ] Update webhook endpoint URL to production domain
- [ ] Test all payment flows in production mode
- [ ] Enable Stripe Radar for fraud detection
- [ ] Set up email receipts in Stripe Dashboard
- [ ] Configure tax collection (if applicable)
- [ ] Set up billing alerts
- [ ] Review Stripe Dashboard settings
- [ ] Test subscription lifecycle (create, update, cancel)
- [ ] Verify webhook delivery and retry logic

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook endpoint is publicly accessible
2. Verify webhook signing secret is correct
3. Check Stripe Dashboard → Developers → Webhooks for failed attempts
4. Review application logs for errors

### Payment Fails During Checkout

1. Check Stripe Dashboard → Payments for error details
2. Verify card details are correct
3. Check if card requires 3D Secure authentication
4. Review declined payment codes in Stripe Dashboard

### Subscription Not Created After Payment

1. Check webhook logs in Stripe Dashboard
2. Verify `customer.subscription.created` event was sent
3. Review application logs for webhook processing errors
4. Check database for subscription record

### Double Subscriptions

The system automatically cancels existing active subscriptions when creating a new one. If you see duplicates:
1. Check `handleSubscriptionCreated` logic
2. Verify unique constraints on subscriptions
3. Review Stripe Dashboard for duplicate payments

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Security](https://stripe.com/docs/security/guide)

## Support

For Stripe-related issues:
- Check [Stripe Support](https://support.stripe.com)
- Review [Stripe Status Page](https://status.stripe.com)
- Join [Stripe Developer Discord](https://stripe.com/discord)
