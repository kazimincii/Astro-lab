import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

interface EffectivePlan {
  planType: 'basic' | 'standard' | 'premium';
  source: 'trial' | 'subscription' | 'default';
  dailyActionLimit: number;
  maxProfiles: number;
  features: string[];
  trial?: {
    startDate: string;
    endDate: string;
    daysRemaining: number;
  };
  subscription?: {
    startDate: string;
    endDate?: string;
    status: string;
  };
}

interface PlanDetails {
  basic: { monthly: number; yearly: number };
  standard: { monthly: number; yearly: number };
  premium: { monthly: number; yearly: number };
}

const planPrices: PlanDetails = {
  basic: { monthly: 0, yearly: 0 },
  standard: { monthly: 10, yearly: 99 },
  premium: { monthly: 19, yearly: 189 },
};

export default function MyPlanScreen() {
  const [effectivePlan, setEffectivePlan] = useState<EffectivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchEffectivePlan();
  }, []);

  const fetchEffectivePlan = async () => {
    try {
      const response = await axios.get('/subscriptions/effective-plan');
      setEffectivePlan(response.data);
    } catch (error) {
      console.error('Error fetching plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType: 'standard' | 'premium') => {
    try {
      // TODO: Integrate with Stripe
      await axios.post('/subscriptions/upgrade', {
        planType,
        billingPeriod,
      });
      fetchEffectivePlan();
    } catch (error) {
      console.error('Error upgrading:', error);
      alert('Failed to upgrade. Please try again.');
    }
  };

  const handleCancelTrial = async () => {
    try {
      await axios.post('/trials/cancel');
      fetchEffectivePlan();
      alert('Trial cancelled successfully');
    } catch (error) {
      console.error('Error cancelling trial:', error);
      alert('Failed to cancel trial');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!effectivePlan) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load plan information</Text>
      </View>
    );
  }

  const getPlanDisplayName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'premium':
        return ['#f59e0b', '#d97706'];
      case 'standard':
        return ['#6366f1', '#8b5cf6'];
      default:
        return ['#4b5563', '#6b7280'];
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Current Plan Card */}
      <LinearGradient
        colors={getPlanColor(effectivePlan.planType)}
        style={styles.currentPlanCard}
      >
        <Text style={styles.currentPlanLabel}>Your Current Plan</Text>
        <Text style={styles.currentPlanName}>
          {getPlanDisplayName(effectivePlan.planType)}
        </Text>

        {effectivePlan.source === 'trial' && effectivePlan.trial && (
          <View style={styles.trialBadge}>
            <Text style={styles.trialText}>
              🎉 Free Trial - {effectivePlan.trial.daysRemaining} days remaining
            </Text>
            <Text style={styles.trialEndDate}>
              Ends on {new Date(effectivePlan.trial.endDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={styles.planStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {effectivePlan.dailyActionLimit === -1
                ? '∞'
                : effectivePlan.dailyActionLimit}
            </Text>
            <Text style={styles.statLabel}>Actions/Day</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{effectivePlan.maxProfiles}</Text>
            <Text style={styles.statLabel}>Max Profiles</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>What's Included</Text>
        {effectivePlan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Trial Actions */}
      {effectivePlan.source === 'trial' && (
        <View style={styles.trialActions}>
          <TouchableOpacity
            style={styles.cancelTrialButton}
            onPress={handleCancelTrial}
          >
            <Text style={styles.cancelTrialText}>Cancel Trial</Text>
          </TouchableOpacity>
          <Text style={styles.trialNote}>
            Cancel anytime. You'll be downgraded to Basic (Free) after trial ends.
          </Text>
        </View>
      )}

      {/* Upgrade Options */}
      {effectivePlan.planType !== 'premium' && (
        <View style={styles.upgradeSection}>
          <Text style={styles.sectionTitle}>Upgrade Your Plan</Text>

          {/* Billing Period Selector */}
          <View style={styles.billingSelector}>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingPeriod === 'monthly' && styles.billingOptionActive,
              ]}
              onPress={() => setBillingPeriod('monthly')}
            >
              <Text
                style={[
                  styles.billingText,
                  billingPeriod === 'monthly' && styles.billingTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingPeriod === 'yearly' && styles.billingOptionActive,
              ]}
              onPress={() => setBillingPeriod('yearly')}
            >
              <Text
                style={[
                  styles.billingText,
                  billingPeriod === 'yearly' && styles.billingTextActive,
                ]}
              >
                Yearly (Save 17%)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Upgrade Cards */}
          {effectivePlan.planType === 'basic' && (
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradePlanName}>Standard</Text>
              <Text style={styles.upgradePrice}>
                ${planPrices.standard[billingPeriod]}
                <Text style={styles.pricePeriod}>
                  /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </Text>
              </Text>
              <Text style={styles.upgradeFeature}>
                • 4 premium actions/day
              </Text>
              <Text style={styles.upgradeFeature}>• Up to 10 profiles</Text>
              <Text style={styles.upgradeFeature}>
                • Advanced charts & tools
              </Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => handleUpgrade('standard')}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Standard</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.upgradeCard}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>BEST VALUE</Text>
            </View>
            <Text style={styles.upgradePlanName}>Premium</Text>
            <Text style={styles.upgradePrice}>
              ${planPrices.premium[billingPeriod]}
              <Text style={styles.pricePeriod}>
                /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
              </Text>
            </Text>
            <Text style={styles.upgradeFeature}>
              • UNLIMITED premium actions
            </Text>
            <Text style={styles.upgradeFeature}>• Up to 50 profiles</Text>
            <Text style={styles.upgradeFeature}>• Pro mode features</Text>
            <Text style={styles.upgradeFeature}>• Priority support</Text>
            <TouchableOpacity
              style={[styles.upgradeButton, styles.upgradeButtonPremium]}
              onPress={() => handleUpgrade('premium')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  currentPlanCard: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
  },
  currentPlanLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  currentPlanName: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trialBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  trialText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trialEndDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  planStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    color: '#10b981',
    fontSize: 18,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    color: '#d1d5db',
    fontSize: 16,
  },
  trialActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  cancelTrialButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  cancelTrialText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  trialNote: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
  upgradeSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  billingSelector: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  billingOptionActive: {
    backgroundColor: '#6366f1',
  },
  billingText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  billingTextActive: {
    color: '#ffffff',
  },
  upgradeCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  upgradePlanName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  upgradePrice: {
    color: '#8b5cf6',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pricePeriod: {
    fontSize: 16,
    color: '#9ca3af',
  },
  upgradeFeature: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 8,
  },
  upgradeButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  upgradeButtonPremium: {
    backgroundColor: '#f59e0b',
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
