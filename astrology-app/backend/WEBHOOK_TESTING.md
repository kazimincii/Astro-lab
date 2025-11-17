# Stripe Webhook Testing Guide

This guide explains how to test and validate the Stripe webhook implementation in the Astrology App backend.

## 📋 Contents

1. [Webhook Implementation Overview](#webhook-implementation-overview)
2. [Configuration](#configuration)
3. [Local Testing with Stripe CLI](#local-testing-with-stripe-cli)
4. [Production Webhook Setup](#production-webhook-setup)
5. [Testing Scenarios](#testing-scenarios)
6. [Troubleshooting](#troubleshooting)

---

## Webhook Implementation Overview

### Endpoint

```
POST /api/payments/webhook
```

**Location**: `src/modules/payments/payments.controller.ts:131-161`

### Handled Events

The webhook handler processes the following Stripe events:

| Event Type | Handler | Description |
|------------|---------|-------------|
| `checkout.session.completed` | `handleCheckoutSessionCompleted()` | Checkout completed successfully |
| `customer.subscription.created` | `handleSubscriptionCreated()` | New subscription created |
| `customer.subscription.updated` | `handleSubscriptionUpdated()` | Subscription modified |
| `customer.subscription.deleted` | `handleSubscriptionDeleted()` | Subscription cancelled |
| `invoice.payment_succeeded` | `handleInvoicePaymentSucceeded()` | Payment successful |
| `invoice.payment_failed` | `handleInvoicePaymentFailed()` | Payment failed |

**Implementation**: `src/modules/payments/payments.service.ts:115-345`

### Security Features

✅ **Signature Verification**: Every webhook request is validated using Stripe's signature
✅ **Raw Body Parsing**: Uses `RawBodyRequest` to access raw payload for verification
✅ **Error Handling**: Catches and logs invalid signatures or malformed payloads
✅ **Metadata Validation**: Checks required metadata before processing events

---

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Stripe Configuration
STRIPE_API_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs
STRIPE_PRICE_STANDARD_MONTHLY=price_1234567890ABC
STRIPE_PRICE_STANDARD_YEARLY=price_0987654321XYZ
STRIPE_PRICE_PREMIUM_MONTHLY=price_ABCDEFGHIJKLM
STRIPE_PRICE_PREMIUM_YEARLY=price_NOPQRSTUVWXYZ
```

### Configuration File

**Location**: `src/config/configuration.ts` or `app.module.ts`

Ensure Stripe configuration is loaded:

```typescript
export default () => ({
  stripe: {
    apiKey: process.env.STRIPE_API_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    prices: {
      standard: {
        monthly: process.env.STRIPE_PRICE_STANDARD_MONTHLY,
        yearly: process.env.STRIPE_PRICE_STANDARD_YEARLY,
      },
      premium: {
        monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
        yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
      },
    },
  },
});
```

---

## Local Testing with Stripe CLI

### 1. Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
curl -s https://packages.stripe.com/api/v1/install | bash
```

**Windows:**
Download from [Stripe CLI Releases](https://github.com/stripe/stripe-cli/releases)

### 2. Login to Stripe

```bash
stripe login
```

This opens a browser to authenticate with your Stripe account.

### 3. Start Your Backend

```bash
cd backend
npm run start:dev
```

Ensure the server is running on `http://localhost:3000` (or your configured port).

### 4. Forward Webhooks to Local Server

```bash
stripe listen --forward-to http://localhost:3000/api/payments/webhook
```

**Output:**
```
> Ready! Your webhook signing secret is whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

**IMPORTANT**: Copy the `whsec_...` secret and add it to your `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

### 5. Restart Backend

After updating `.env`, restart the backend:

```bash
npm run start:dev
```

---

## Testing Scenarios

### Test 1: Subscription Created

**Trigger the event:**
```bash
stripe trigger customer.subscription.created
```

**Expected behavior:**
- ✅ Webhook endpoint receives event
- ✅ Signature verified successfully
- ✅ New subscription created in database
- ✅ User's subscription status updated to ACTIVE
- ✅ Log: "Subscription created for user {userId}"

**Verify in database:**
```sql
SELECT * FROM subscriptions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1;
```

### Test 2: Subscription Updated

**Trigger the event:**
```bash
stripe trigger customer.subscription.updated
```

**Expected behavior:**
- ✅ Subscription record updated
- ✅ Current period start/end dates updated
- ✅ Status synced with Stripe
- ✅ Log: "Subscription updated: {subscriptionId}"

### Test 3: Subscription Deleted

**Trigger the event:**
```bash
stripe trigger customer.subscription.deleted
```

**Expected behavior:**
- ✅ Subscription status changed to CANCELLED
- ✅ `cancelledAt` timestamp set
- ✅ Log: "Subscription deleted: {subscriptionId}"

### Test 4: Invoice Payment Succeeded

**Trigger the event:**
```bash
stripe trigger invoice.payment_succeeded
```

**Expected behavior:**
- ✅ Payment recorded
- ✅ Log: "Payment succeeded for subscription: {subscriptionId}"
- ✅ (Optional) Receipt email sent to user

### Test 5: Invoice Payment Failed

**Trigger the event:**
```bash
stripe trigger invoice.payment_failed
```

**Expected behavior:**
- ✅ Payment failure logged
- ✅ Warning: "Payment failed for subscription: {subscriptionId}"
- ✅ (Optional) Failure notification sent to user

### Test 6: Checkout Session Completed

**Trigger the event:**
```bash
stripe trigger checkout.session.completed
```

**Expected behavior:**
- ✅ Checkout completion logged
- ✅ Metadata validated (userId, planType, billingPeriod)
- ✅ Log: "Checkout completed for user {userId}, plan {planType}"

---

## Full Integration Test Flow

### End-to-End Subscription Test

This test simulates a real user subscribing to a plan.

**1. Create Checkout Session (Mobile App)**

```bash
curl -X POST http://localhost:3000/api/payments/checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planType": "premium",
    "billingPeriod": "monthly",
    "successUrl": "astrology://payment-success",
    "cancelUrl": "astrology://payment-cancel"
  }'
```

**Response:**
```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**2. Complete Payment in Stripe Dashboard**

1. Open the `url` from the response in a browser
2. Use test card: `4242 4242 4242 4242`
3. CVC: Any 3 digits
4. Expiry: Any future date
5. Complete payment

**3. Webhook Events Fired (automatically)**

Stripe will send these webhooks to your local server:

```
✅ checkout.session.completed
✅ customer.subscription.created
✅ invoice.payment_succeeded
```

**4. Verify in Backend Logs**

```
[PaymentsService] Processing webhook event: checkout.session.completed
[PaymentsService] Checkout completed for user 123, plan premium
[PaymentsService] Processing webhook event: customer.subscription.created
[PaymentsService] Subscription created for user 123
[PaymentsService] Processing webhook event: invoice.payment_succeeded
[PaymentsService] Payment succeeded for subscription: sub_abc123
```

**5. Verify in Database**

```sql
-- Check subscription was created
SELECT
  id,
  user_id,
  plan_type,
  billing_period,
  status,
  stripe_subscription_id,
  created_at
FROM subscriptions
WHERE user_id = '123'
ORDER BY created_at DESC
LIMIT 1;
```

Expected result:
```
id: 1
user_id: 123
plan_type: premium
billing_period: monthly
status: active
stripe_subscription_id: sub_abc123
created_at: 2024-11-16 10:30:00
```

---

## Production Webhook Setup

### 1. Deploy Backend

Deploy your backend to production (e.g., AWS, Heroku, DigitalOcean):

```
https://api.astrology.com
```

### 2. Add Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → Webhooks**
3. Click **Add endpoint**
4. Enter endpoint URL:
   ```
   https://api.astrology.com/api/payments/webhook
   ```
5. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Click **Add endpoint**

### 3. Get Production Webhook Secret

After creating the endpoint, Stripe will show:

```
Signing secret: whsec_PRODUCTION_SECRET_HERE
```

**Add to production environment variables:**

```env
STRIPE_WEBHOOK_SECRET=whsec_PRODUCTION_SECRET_HERE
```

### 4. Test Production Webhook

From Stripe Dashboard:

1. Go to **Developers → Webhooks**
2. Click on your webhook endpoint
3. Click **Send test webhook**
4. Select event type (e.g., `customer.subscription.created`)
5. Click **Send test webhook**

Check your backend logs to confirm receipt.

---

## Webhook Signature Verification

### How It Works

**Code**: `src/modules/payments/payments.service.ts:115-125`

```typescript
async handleWebhook(signature: string, payload: Buffer): Promise<void> {
  const webhookSecret = this.configService.get<string>('stripe.webhookSecret');

  let event: Stripe.Event;

  try {
    // Verify signature
    event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret!);
  } catch (error) {
    this.logger.error('Webhook signature verification failed', error);
    throw new BadRequestException('Invalid webhook signature');
  }

  // Process event...
}
```

### Security Notes

- ✅ **Raw body required**: NestJS must provide the raw request body (not parsed JSON)
- ✅ **Signature in header**: `stripe-signature` header contains the signature
- ✅ **Secret verification**: Webhook secret from Stripe Dashboard must match
- ❌ **Never skip verification**: Always validate signatures in production

---

## Troubleshooting

### Issue 1: "Invalid webhook signature"

**Symptom:**
```
[PaymentsService] Webhook signature verification failed
```

**Causes:**
1. Webhook secret mismatch
2. Raw body not available
3. Request body was parsed before signature verification

**Solutions:**

**Check webhook secret:**
```bash
# Make sure .env has correct secret
cat .env | grep STRIPE_WEBHOOK_SECRET

# Should match Stripe CLI output or Dashboard secret
```

**Ensure raw body middleware:**

In `main.ts` or `app.module.ts`:

```typescript
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,  // ✅ Enable raw body
  });

  // Use express json middleware with verify function
  app.use(
    json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  await app.listen(3000);
}
```

### Issue 2: "Missing metadata in subscription"

**Symptom:**
```
[PaymentsService] Missing metadata in subscription
```

**Cause:**
Checkout session or subscription was created without required metadata.

**Solution:**

Ensure checkout session includes metadata:

```typescript
// In createCheckoutSession()
const session = await this.stripe.checkout.sessions.create({
  // ...
  metadata: {
    userId: 'user_123',  // ✅ Required
    planType: 'premium',  // ✅ Required
    billingPeriod: 'monthly',  // ✅ Required
  },
  subscription_data: {
    metadata: {
      userId: 'user_123',  // ✅ Also add to subscription
      planType: 'premium',
      billingPeriod: 'monthly',
    },
  },
});
```

### Issue 3: Webhook not receiving events

**Symptom:**
No webhook events appear in logs, even though Stripe CLI is running.

**Causes:**
1. Backend not running
2. Wrong port or URL
3. Firewall blocking connections
4. Stripe CLI not forwarding

**Solutions:**

**Check backend is running:**
```bash
curl http://localhost:3000/api/health
```

**Check Stripe CLI:**
```bash
stripe listen --forward-to http://localhost:3000/api/payments/webhook

# Should output:
# > Ready! Your webhook signing secret is whsec_...
```

**Test manually:**
```bash
stripe trigger customer.subscription.created
```

**Check logs:**
```bash
# Backend should log:
[PaymentsService] Processing webhook event: customer.subscription.created
```

### Issue 4: Database errors during webhook handling

**Symptom:**
```
[PaymentsService] Failed to save subscription
```

**Causes:**
1. Database connection lost
2. Missing columns in subscriptions table
3. Foreign key constraint failures
4. Duplicate subscription IDs

**Solutions:**

**Check database schema:**
```sql
DESCRIBE subscriptions;

-- Required columns:
-- id, user_id, plan_type, billing_period, status,
-- stripe_subscription_id, stripe_customer_id,
-- current_period_start, current_period_end,
-- start_date, end_date, cancelled_at, cancel_at_period_end,
-- created_at, updated_at
```

**Check user exists:**
```sql
SELECT id FROM users WHERE id = 'user_id_from_metadata';
```

**Check for duplicates:**
```sql
SELECT stripe_subscription_id, COUNT(*)
FROM subscriptions
GROUP BY stripe_subscription_id
HAVING COUNT(*) > 1;
```

---

## Monitoring Webhooks in Production

### Stripe Dashboard

**View webhook delivery:**
1. Go to **Developers → Webhooks**
2. Click on your endpoint
3. View **Attempts** tab

**Filter by:**
- ✅ Successful (200 OK)
- ❌ Failed (4xx/5xx)

### Backend Logs

**Log all webhook events:**

```typescript
this.logger.log(`Processing webhook event: ${event.type}`);
```

**Use logging service:**
- Sentry
- DataDog
- CloudWatch
- LogRocket

### Alerting

Set up alerts for:
- ❌ High webhook failure rate (>5% failures)
- ❌ Repeated signature verification failures
- ❌ Payment failures
- ❌ Subscription cancellations spike

---

## Event Handler Details

### handleSubscriptionCreated()

**Location**: `payments.service.ts:226-259`

**Functionality:**
1. Extract metadata (userId, planType, billingPeriod)
2. Cancel any existing active subscriptions for user
3. Create new subscription record
4. Save to database

**Database changes:**
```sql
-- Cancel old subscriptions
UPDATE subscriptions
SET status = 'cancelled', cancelled_at = NOW()
WHERE user_id = ? AND status = 'active';

-- Insert new subscription
INSERT INTO subscriptions
(user_id, plan_type, billing_period, status, stripe_subscription_id, ...)
VALUES (?, ?, ?, 'active', ?, ...);
```

### handleSubscriptionUpdated()

**Location**: `payments.service.ts:264-285`

**Functionality:**
1. Find subscription by Stripe subscription ID
2. Update status, period dates
3. Handle cancel_at_period_end flag
4. Save changes

**Database changes:**
```sql
UPDATE subscriptions
SET
  status = ?,
  current_period_start = ?,
  current_period_end = ?,
  cancel_at_period_end = ?
WHERE stripe_subscription_id = ?;
```

### handleSubscriptionDeleted()

**Location**: `payments.service.ts:290-305`

**Functionality:**
1. Find subscription by Stripe subscription ID
2. Set status to CANCELLED
3. Set cancelledAt timestamp
4. Save changes

**Database changes:**
```sql
UPDATE subscriptions
SET status = 'cancelled', cancelled_at = NOW()
WHERE stripe_subscription_id = ?;
```

---

## Testing Checklist

Before deploying to production:

- [ ] Local webhook tests pass with Stripe CLI
- [ ] All 6 event types handled correctly
- [ ] Signature verification working
- [ ] Database updates successful
- [ ] Metadata validation working
- [ ] Error handling tested (invalid signature, missing data)
- [ ] Logs are clear and informative
- [ ] Production webhook endpoint configured in Stripe Dashboard
- [ ] Production webhook secret added to environment variables
- [ ] End-to-end payment flow tested on staging
- [ ] Monitoring and alerts configured

---

## Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Testing Stripe Webhooks](https://stripe.com/docs/webhooks/test)
- [Webhook Event Reference](https://stripe.com/docs/api/events/types)

---

**Last Updated**: 2024-11-16
**Version**: MVP 1.0
**Backend Implementation**: Complete ✅
