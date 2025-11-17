import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { paymentsApi } from '@/api/payments';

interface PaymentSheetProps {
  planType: 'basic' | 'standard' | 'premium';
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentSheet({
  planType,
  billingCycle,
  amount,
  onSuccess,
  onCancel,
}: PaymentSheetProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create payment intent from backend
      const { clientSecret } = await paymentsApi.createPaymentIntent(
        `${planType}_${billingCycle}`
      );

      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Astrology App',
        style: 'automatic',
        returnURL: 'astrology://payment-return',
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        setLoading(false);
        return;
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== 'Canceled') {
          Alert.alert('Payment Failed', presentError.message);
        }
        setLoading(false);
        return;
      }

      // Payment successful
      Alert.alert(
        'Success',
        'Your subscription has been activated!',
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert('Error', error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const getPlanName = () => {
    return planType.charAt(0).toUpperCase() + planType.slice(1);
  };

  const getBillingText = () => {
    return billingCycle === 'monthly' ? '/month' : '/year';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Payment</Text>
        <TouchableOpacity onPress={onCancel} disabled={loading}>
          <Ionicons name="close" size={24} color={colors.cosmic.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Plan:</Text>
          <Text style={styles.summaryValue}>{getPlanName()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Billing:</Text>
          <Text style={styles.summaryValue}>
            {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            ${amount}
            {getBillingText()}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="shield-checkmark" size={20} color={colors.cosmic.purple} />
        <Text style={styles.infoText}>
          Secure payment powered by Stripe. Your payment information is encrypted and secure.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.cosmic.text} />
        ) : (
          <>
            <Ionicons name="card" size={20} color={colors.cosmic.text} />
            <Text style={styles.payButtonText}>Pay ${amount}</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cosmic.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.cosmic.text,
  },
  summaryCard: {
    backgroundColor: colors.cosmic.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#26263a',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.cosmic.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cosmic.text,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#26263a',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.cosmic.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.cosmic.purple,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.cosmic.textSecondary,
    lineHeight: 18,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cosmic.purple,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    gap: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.cosmic.text,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.cosmic.textSecondary,
  },
});
