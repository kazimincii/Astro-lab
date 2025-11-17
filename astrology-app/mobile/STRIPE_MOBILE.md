# Stripe Payment Integration - Mobile

This document explains how to integrate Stripe payments in the React Native mobile app.

## Overview

The mobile app uses Stripe Checkout (web-based) for subscription purchases. Users are redirected to Stripe's hosted checkout page, then return to the app after completion.

## Installation

Install required dependencies:

```bash
npm install @stripe/stripe-react-native
```

Or with Expo:

```bash
npx expo install @stripe/stripe-react-native
```

## Setup

### 1. Configure Deep Links

Update `app.json` to handle payment redirects:

```json
{
  "expo": {
    "scheme": "astrologyapp",
    "ios": {
      "bundleIdentifier": "com.astrologyapp.app"
    },
    "android": {
      "package": "com.astrologyapp.app"
    }
  }
}
```

### 2. Create Payment Service

Create `src/services/payment.ts`:

```typescript
import { API_URL } from '../config/api';
import { storage } from '../utils/storage';

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface UpcomingInvoice {
  amountDue: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
}

class PaymentService {
  private async getAuthHeaders() {
    const token = await storage.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createCheckout(
    planType: 'standard' | 'premium',
    billingPeriod: 'monthly' | 'yearly',
  ): Promise<CheckoutSession> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_URL}/payments/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        planType,
        billingPeriod,
        successUrl: 'astrologyapp://subscription/success',
        cancelUrl: 'astrologyapp://subscription/cancel',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  }

  async createPortal(): Promise<{ url: string }> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_URL}/payments/portal`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        returnUrl: 'astrologyapp://settings',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    return response.json();
  }

  async cancelSubscription(): Promise<void> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_URL}/payments/subscription`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
  }

  async getUpcomingInvoice(): Promise<UpcomingInvoice> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_URL}/payments/upcoming-invoice`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to get upcoming invoice');
    }

    return response.json();
  }
}

export const paymentService = new PaymentService();
```

### 3. Create Subscription Screen

Create `src/screens/subscription/SubscriptionScreen.tsx`:

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { paymentService } from '../../services/payment';

const PLANS = [
  {
    id: 'standard',
    name: 'Standard',
    monthlyPrice: 10,
    yearlyPrice: 100,
    features: [
      '10 Birth Charts',
      '4 Premium Actions/Day',
      'All Basic Features',
      'Email Support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      '50 Birth Charts',
      'Unlimited Premium Actions',
      'All Advanced Features',
      'Priority Support',
      'Early Access to New Features',
    ],
  },
];

export function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const { url } = await paymentService.createCheckout(
        selectedPlan as any,
        billingPeriod,
      );

      // Open Stripe Checkout in browser
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open payment page');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Error', 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>

      {/* Billing Period Toggle */}
      <View style={styles.periodToggle}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            billingPeriod === 'monthly' && styles.periodButtonActive,
          ]}
          onPress={() => setBillingPeriod('monthly')}
        >
          <Text style={styles.periodText}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            billingPeriod === 'yearly' && styles.periodButtonActive,
          ]}
          onPress={() => setBillingPeriod('yearly')}
        >
          <Text style={styles.periodText}>
            Yearly <Text style={styles.discount}>(Save 17%)</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Plan Cards */}
      {PLANS.map((plan) => {
        const price = billingPeriod === 'monthly'
          ? plan.monthlyPrice
          : plan.yearlyPrice;
        const monthlyEquivalent = billingPeriod === 'yearly'
          ? (price / 12).toFixed(2)
          : price;

        return (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardActive,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>
              ${monthlyEquivalent}
              <Text style={styles.planPeriod}>/month</Text>
            </Text>
            {billingPeriod === 'yearly' && (
              <Text style={styles.billedYearly}>
                Billed ${price} yearly
              </Text>
            )}
            <View style={styles.features}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.feature}>
                  ✓ {feature}
                </Text>
              ))}
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.subscribeButton, loading && styles.subscribeButtonDisabled]}
        onPress={handleSubscribe}
        disabled={loading}
      >
        <Text style={styles.subscribeButtonText}>
          {loading ? 'Loading...' : 'Subscribe Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#1a1b2e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#6366f1',
  },
  periodText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  discount: {
    fontSize: 12,
    color: '#a5f3fc',
  },
  planCard: {
    backgroundColor: '#1a1b2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardActive: {
    borderColor: '#6366f1',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  planPeriod: {
    fontSize: 18,
    color: '#9ca3af',
  },
  billedYearly: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  features: {
    marginTop: 16,
  },
  feature: {
    fontSize: 16,
    color: '#d1d5db',
    marginBottom: 8,
  },
  subscribeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  subscribeButtonDisabled: {
    opacity: 0.5,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
```

### 4. Handle Deep Link Returns

Update your navigation to handle return URLs:

```typescript
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function usePaymentRedirects() {
  const navigation = useNavigation();

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      if (url.includes('subscription/success')) {
        navigation.navigate('SubscriptionSuccess');
      } else if (url.includes('subscription/cancel')) {
        navigation.navigate('SubscriptionCancel');
      }
    };

    // Handle URL when app is already open
    Linking.addEventListener('url', handleUrl);

    // Handle URL when app is opened from link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url });
      }
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [navigation]);
}
```

### 5. Create Manage Subscription Screen

For existing subscribers to manage their subscription:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { paymentService } from '../../services/payment';
import { subscriptionService } from '../../services/subscription';

export function ManageSubscriptionScreen() {
  const [subscription, setSubscription] = useState<any>(null);
  const [upcomingInvoice, setUpcomingInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const sub = await subscriptionService.getCurrentSubscription();
      setSubscription(sub);

      if (sub?.status === 'active') {
        const invoice = await paymentService.getUpcomingInvoice();
        setUpcomingInvoice(invoice);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManage = async () => {
    try {
      const { url } = await paymentService.createPortal();

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Portal error:', error);
      Alert.alert('Error', 'Failed to open subscription portal');
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel? You will lose access to premium features.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              await paymentService.cancelSubscription();
              Alert.alert('Success', 'Subscription cancelled');
              loadSubscription();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel subscription');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Subscription</Text>

      {subscription && (
        <View style={styles.card}>
          <Text style={styles.planName}>{subscription.planType} Plan</Text>
          <Text style={styles.status}>Status: {subscription.status}</Text>

          {upcomingInvoice && (
            <View style={styles.invoiceSection}>
              <Text style={styles.invoiceTitle}>Next Payment</Text>
              <Text style={styles.invoiceAmount}>
                ${upcomingInvoice.amountDue} on {new Date(upcomingInvoice.periodEnd).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.manageButton} onPress={handleManage}>
        <Text style={styles.manageButtonText}>Manage Payment Method</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a1b2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#9ca3af',
  },
  invoiceSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  invoiceTitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 8,
  },
  invoiceAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  manageButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});
```

## Testing

### Test the Flow

1. Run the app and navigate to subscription screen
2. Select a plan and billing period
3. Click "Subscribe Now"
4. Complete checkout on Stripe (use test card: 4242 4242 4242 4242)
5. Verify redirect back to app with success URL
6. Check subscription is created in backend

### Test Cards

Use Stripe test cards for testing:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0027 6000 3184

## Best Practices

1. **Error Handling**: Always handle errors gracefully and show user-friendly messages
2. **Loading States**: Show loading indicators during API calls
3. **Deep Link Testing**: Test deep links on both iOS and Android
4. **Subscription State**: Keep subscription state in sync with backend
5. **Offline Support**: Handle network errors and retry logic
6. **Security**: Never store Stripe keys in the app, always call backend API

## Production Checklist

- [ ] Update app scheme in app.json
- [ ] Configure iOS Associated Domains
- [ ] Configure Android App Links
- [ ] Test payment flow on physical devices
- [ ] Test deep link handling
- [ ] Verify subscription states sync correctly
- [ ] Test cancellation and reactivation flows
- [ ] Add analytics tracking for payment events
- [ ] Test error scenarios (declined cards, network errors)
- [ ] Review App Store / Play Store payment guidelines
