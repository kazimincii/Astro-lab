import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { actionsApi, trialsApi, paymentsApi } from '@/api';
import { PaymentSheet } from '@/components/PaymentSheet';
import { PLAN_PRICING } from '@/config/stripe';

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

const comparisonRows = [
  { label: 'Premium actions/day', basic: '2', standard: '4', premium: 'Unlimited' },
  { label: 'Profiles', basic: '3', standard: '10', premium: '50' },
  { label: 'Advanced tools', basic: 'Limited', standard: 'Most', premium: 'All' },
  { label: 'Support', basic: 'Community', standard: 'Priority', premium: 'Priority+' },
];

export default function MyPlanScreen() {
  const { t } = useTranslation();
  const [effectivePlan, setEffectivePlan] = useState<EffectivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'premium' | null>(null);

  useEffect(() => {
    fetchEffectivePlan();
  }, []);

  const fetchEffectivePlan = async () => {
    try {
      const data = await actionsApi.getEffectivePlan();
      setEffectivePlan(data);
    } catch (error) {
      console.error('Error fetching plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (planType: 'standard' | 'premium') => {
    setSelectedPlan(planType);
    setShowPaymentSheet(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentSheet(false);
    setSelectedPlan(null);
    await fetchEffectivePlan();
  };

  const handlePaymentCancel = () => {
    setShowPaymentSheet(false);
    setSelectedPlan(null);
  };

  const handleCancelTrial = async () => {
    try {
      await trialsApi.cancelTrial();
      await fetchEffectivePlan();
      alert(t('common.messages.success'));
    } catch (error) {
      console.error('Error cancelling trial:', error);
      alert(t('common.errors.generic'));
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
        <Text style={styles.errorText}>{t('plans.myPlan.error')}</Text>
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
        <Text style={styles.currentPlanLabel}>{t('plans.myPlan.currentPlan')}</Text>
        <Text style={styles.currentPlanName}>
          {getPlanDisplayName(effectivePlan.planType)}
        </Text>

        {effectivePlan.source === 'trial' && effectivePlan.trial && (
          <View style={styles.trialBadge}>
            <Text style={styles.trialText}>
              ✨ {t('plans.myPlan.trial.freeTrial')} - {t('plans.myPlan.trial.daysRemaining', { count: effectivePlan.trial.daysRemaining })}
            </Text>
            <Text style={styles.trialEndDate}>
              {t('plans.myPlan.trial.endsOn', { date: new Date(effectivePlan.trial.endDate).toLocaleDateString() })}
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
            <Text style={styles.statLabel}>{t('plans.myPlan.actionsPerDay')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{effectivePlan.maxProfiles}</Text>
            <Text style={styles.statLabel}>{t('plans.myPlan.maxProfiles')}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>{t('plans.myPlan.whatsIncluded')}</Text>
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
            <Text style={styles.cancelTrialText}>{t('plans.myPlan.trial.cancelTrial')}</Text>
          </TouchableOpacity>
          <Text style={styles.trialNote}>
            {t('plans.myPlan.trial.cancelNote')}
          </Text>
        </View>
      )}

      {/* Upgrade Options */}
      {effectivePlan.planType !== 'premium' && (
        <View style={styles.upgradeSection}>
          <Text style={styles.sectionTitle}>{t('plans.myPlan.upgradePlan')}</Text>

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
                {t('plans.myPlan.billing.monthly')}
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
                {t('plans.myPlan.billing.yearly')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Upgrade Cards */}
          {effectivePlan.planType === 'basic' && (
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradePlanName}>{t('plans.standard.name')}</Text>
              <Text style={styles.upgradePrice}>
                ${PLAN_PRICING.standard[billingPeriod]}
                <Text style={styles.pricePeriod}>
                  /{t(`plans.myPlan.billing.${billingPeriod === 'monthly' ? 'monthShort' : 'yearShort'}`)}
                </Text>
              </Text>
              <Text style={styles.upgradeFeature}>
                • {t('plans.myPlan.planFeatures.standard.actions')}
              </Text>
              <Text style={styles.upgradeFeature}>• {t('plans.myPlan.planFeatures.standard.profiles')}</Text>
              <Text style={styles.upgradeFeature}>
                • {t('plans.myPlan.planFeatures.standard.charts')}
              </Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => handleUpgrade('standard')}
              >
                <Text style={styles.upgradeButtonText}>{t('plans.myPlan.upgradeButtons.upgradeToStandard')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.upgradeCard}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>{t('plans.myPlan.badges.bestValue')}</Text>
            </View>
            <Text style={styles.upgradePlanName}>{t('plans.premiumPlan.name')}</Text>
            <Text style={styles.upgradePrice}>
              ${PLAN_PRICING.premium[billingPeriod]}
              <Text style={styles.pricePeriod}>
                /{t(`plans.myPlan.billing.${billingPeriod === 'monthly' ? 'monthShort' : 'yearShort'}`)}
              </Text>
            </Text>
            <Text style={styles.upgradeFeature}>
              • {t('plans.myPlan.planFeatures.premium.actions')}
            </Text>
            <Text style={styles.upgradeFeature}>• {t('plans.myPlan.planFeatures.premium.profiles')}</Text>
            <Text style={styles.upgradeFeature}>• {t('plans.myPlan.planFeatures.premium.proMode')}</Text>
            <Text style={styles.upgradeFeature}>• {t('plans.myPlan.planFeatures.premium.support')}</Text>
            <TouchableOpacity
              style={[styles.upgradeButton, styles.upgradeButtonPremium]}
              onPress={() => handleUpgrade('premium')}
            >
              <Text style={styles.upgradeButtonText}>{t('plans.myPlan.upgradeButtons.upgradeToPremium')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Payment Modal */}
      <Modal
        visible={showPaymentSheet}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handlePaymentCancel}
      >
        {selectedPlan && (
          <PaymentSheet
            planType={selectedPlan}
            billingCycle={billingPeriod}
            amount={PLAN_PRICING[selectedPlan][billingPeriod]}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
      </Modal>
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
