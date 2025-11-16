import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

type PlanType = 'basic' | 'standard' | 'premium';

interface PlanOption {
  type: PlanType;
  name: string;
  price: string;
  features: string[];
  actionLimit: string;
  profileLimit: string;
  highlighted?: boolean;
}

const planOptions: PlanOption[] = [
  {
    type: 'basic',
    name: 'Basic',
    price: 'Free',
    features: [
      'Birth charts & basic interpretations',
      'Daily forecasts',
      '2 premium actions per day',
      'Up to 2 profiles',
      'Basic AI assistant',
    ],
    actionLimit: '2 actions/day',
    profileLimit: '2 profiles',
  },
  {
    type: 'standard',
    name: 'Standard',
    price: '$10/month',
    features: [
      'Everything in Basic',
      '4 premium actions per day',
      'Up to 10 profiles',
      'Advanced charts & tools',
      'Full calendars & soulmate',
      '7-day FREE trial',
    ],
    actionLimit: '4 actions/day',
    profileLimit: '10 profiles',
    highlighted: true,
  },
  {
    type: 'premium',
    name: 'Premium',
    price: '$19/month',
    features: [
      'Everything in Standard',
      'UNLIMITED premium actions',
      'Up to 50 profiles',
      'Pro mode interpretations',
      'Priority support',
      '7-day FREE trial',
    ],
    actionLimit: 'Unlimited',
    profileLimit: '50 profiles',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('standard');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      if (selectedPlan !== 'basic') {
        // Start trial for Standard or Premium
        await axios.post('/trials/start', {
          planType: selectedPlan,
        });
      }
      // Navigate to main app
      navigation.navigate('Main' as never);
    } catch (error) {
      console.error('Error starting plan:', error);
      alert('Failed to start plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Journey</Text>
        <Text style={styles.subtitle}>
          Select a plan to unlock your cosmic potential
        </Text>
      </View>

      <View style={styles.plansContainer}>
        {planOptions.map((plan) => (
          <TouchableOpacity
            key={plan.type}
            onPress={() => setSelectedPlan(plan.type)}
            style={[
              styles.planCard,
              selectedPlan === plan.type && styles.planCardSelected,
              plan.highlighted && styles.planCardHighlighted,
            ]}
          >
            {plan.highlighted && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>POPULAR</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
            </View>

            <View style={styles.planLimits}>
              <Text style={styles.limitText}>⚡ {plan.actionLimit}</Text>
              <Text style={styles.limitText}>👤 {plan.profileLimit}</Text>
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {selectedPlan === plan.type && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>SELECTED</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading}
      >
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Starting...' : 'Continue'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        {selectedPlan !== 'basic'
          ? 'Start your 7-day free trial. Cancel anytime before trial ends.'
          : 'You can upgrade to premium features anytime.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  plansContainer: {
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#1e1e3a',
  },
  planCardHighlighted: {
    borderColor: '#f59e0b',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    marginBottom: 12,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  planLimits: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  limitText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  featuresContainer: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkmark: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    color: '#d1d5db',
    fontSize: 14,
  },
  selectedIndicator: {
    marginTop: 16,
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  continueButton: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});
