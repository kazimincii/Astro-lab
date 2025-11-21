// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { actionsApi, trialsApi } from '@/api';
import { PaymentSheet } from '@/components/PaymentSheet';
import { PLAN_PRICING } from '@/config/stripe';
import { colors } from '@/theme/colors';

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

export default function MyPlanScreen() {
  const { t } = useTranslation();

  const comparisonRows = [
    { label: t('plans:comparison.rows.premiumActions'), basic: '2', standard: '4', premium: t('plans:comparison.values.unlimited') },
    { label: t('plans:comparison.rows.profiles'), basic: '3', standard: '10', premium: '50' },
    { label: t('plans:comparison.rows.advancedTools'), basic: t('plans:comparison.values.limited'), standard: t('plans:comparison.values.most'), premium: t('plans:comparison.values.all') },
    { label: t('plans:comparison.rows.support'), basic: t('plans:comparison.values.community'), standard: t('plans:comparison.values.priority'), premium: t('plans:comparison.values.priorityPlus') },
  ];
  const [effectivePlan, setEffectivePlan] = useState<EffectivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'premium' | null>(
    null,
  );

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
      Alert.alert('', t('plans:myPlan.trial.cancelSuccess'));
    } catch (error) {
      console.error('Error cancelling trial:', error);
      Alert.alert('', t('plans:myPlan.trial.cancelError'));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.cosmic.purple} />
      </View>
    );
  }

  if (!effectivePlan) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('plans:myPlan.error')}</Text>
      </View>
    );
  }

  const getPlanDisplayName = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1);

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
      <LinearGradient colors={getPlanColor(effectivePlan.planType)} style={styles.currentPlanCard}>
        <Text style={styles.currentPlanLabel}>{t('plans:myPlan.currentPlan')}</Text>
        <Text style={styles.currentPlanName}>{getPlanDisplayName(effectivePlan.planType)}</Text>

        {effectivePlan.source === 'trial' && effectivePlan.trial && (
          <View style={styles.trialBadge}>
            <Text style={styles.trialText}>
              {t('plans:myPlan.trial.freeTrial', { count: effectivePlan.trial.daysRemaining })}
            </Text>
            <Text style={styles.trialEndDate}>
              {t('plans:myPlan.trial.endsOn', { date: new Date(effectivePlan.trial.endDate).toLocaleDateString() })}
            </Text>
          </View>
        )}

        <View style={styles.planStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {effectivePlan.dailyActionLimit === -1 ? '∞' : effectivePlan.dailyActionLimit}
            </Text>
            <Text style={styles.statLabel}>{t('plans:myPlan.actionsPerDay')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{effectivePlan.maxProfiles}</Text>
            <Text style={styles.statLabel}>{t('plans:myPlan.maxProfiles')}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>{t('plans:myPlan.whatsIncluded')}</Text>
        {effectivePlan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.comparisonSection}>
        <Text style={styles.sectionTitle}>{t('plans:comparison.planComparison')}</Text>
        <View style={styles.comparisonHeader}>
          <Text style={styles.comparisonLabel}>{t('plans:comparison.headers.feature')}</Text>
          <Text style={styles.comparisonPlan}>{t('plans:comparison.headers.basic')}</Text>
          <Text style={styles.comparisonPlan}>{t('plans:comparison.headers.standard')}</Text>
          <Text style={styles.comparisonPlan}>{t('plans:comparison.headers.premium')}</Text>
        </View>
        {comparisonRows.map(row => (
          <View key={row.label} style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>{row.label}</Text>
            <Text style={styles.comparisonValue}>{row.basic}</Text>
            <Text style={styles.comparisonValue}>{row.standard}</Text>
            <Text style={styles.comparisonValue}>{row.premium}</Text>
          </View>
        ))}
      </View>

      {effectivePlan.source !== 'trial' && effectivePlan.planType === 'basic' && (
        <View style={styles.trialOffer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.trialOfferTitle}>{t('plans:myPlan.trial.sevenDayPremium')}</Text>
            <Text style={styles.trialOfferText}>
              {t('plans:myPlan.trial.tryUnlimited')}
            </Text>
          </View>
          <TouchableOpacity style={styles.trialOfferButton} onPress={() => handleUpgrade('premium')}>
            <Text style={styles.trialOfferButtonText}>{t('plans:myPlan.trial.startTrial')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {effectivePlan.source === 'trial' && (
        <View style={styles.trialActions}>
          <TouchableOpacity style={styles.cancelTrialButton} onPress={handleCancelTrial}>
            <Text style={styles.cancelTrialText}>{t('plans:myPlan.trial.cancelTrial')}</Text>
          </TouchableOpacity>
          <Text style={styles.trialNote}>
            {t('plans:myPlan.trial.cancelNote')}
          </Text>
        </View>
      )}

      {effectivePlan.planType !== 'premium' && (
        <View style={styles.upgradeSection}>
          <Text style={styles.sectionTitle}>{t('plans:myPlan.upgradePlan')}</Text>

          <View style={styles.billingSelector}>
            <TouchableOpacity
              style={[styles.billingOption, billingPeriod === 'monthly' && styles.billingOptionActive]}
              onPress={() => setBillingPeriod('monthly')}
            >
              <Text style={[styles.billingText, billingPeriod === 'monthly' && styles.billingTextActive]}>
                {t('plans:myPlan.billing.monthly')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.billingOption, billingPeriod === 'yearly' && styles.billingOptionActive]}
              onPress={() => setBillingPeriod('yearly')}
            >
              <Text style={[styles.billingText, billingPeriod === 'yearly' && styles.billingTextActive]}>
                {t('plans:myPlan.billing.yearly')}
              </Text>
            </TouchableOpacity>
          </View>

          {effectivePlan.planType === 'basic' && (
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradePlanName}>{t('plans:comparison.headers.standard')}</Text>
              <Text style={styles.upgradePrice}>
                ${PLAN_PRICING.standard[billingPeriod]}
                <Text style={styles.pricePeriod}>/{t(`plans:myPlan.billing.${billingPeriod === 'monthly' ? 'monthShort' : 'yearShort'}`)}</Text>
              </Text>
              <Text style={styles.upgradeFeature}>• {t('plans:myPlan.planFeatures.standard.actions')}</Text>
              <Text style={styles.upgradeFeature}>• {t('plans:myPlan.planFeatures.standard.profiles')}</Text>
              <Text style={styles.upgradeFeature}>• {t('plans:myPlan.planFeatures.standard.charts')}</Text>
              <TouchableOpacity style={styles.upgradeButton} onPress={() => handleUpgrade('standard')}>
                <Text style={styles.upgradeButtonText}>{t('plans:myPlan.upgradeButtons.upgradeToStandard')}</Text>
              </TouchableOpacity>
              <Text style={styles.upgradeNote}>{t(billingPeriod === 'monthly' ? 'plans:myPlan.billing.chargedMonthly' : 'plans:myPlan.billing.chargedYearly')}</Text>
            </View>
          )}

          <View style={styles.upgradeCard}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>{t('plans:myPlan.badges.bestValue')}</Text>
            </View>
            <Text style={styles.upgradePlanName}>{t('plans:comparison.headers.premium')}</Text>
            <Text style={styles.upgradePrice}>
              ${PLAN_PRICING.premium[billingPeriod]}
              <Text style={styles.pricePeriod}>/{t(`plans:myPlan.billing.${billingPeriod === 'monthly' ? 'monthShort' : 'yearShort'}`)}</Text>
            </Text>
            <Text style={styles.upgradeFeature}>• {t('plans:myPlan.planFeatures.premium.actions')}</Text>
            <Text style={styles.upgradeFeature}>• {t('plans:myPlan.planFeatures.premium.profiles')}</Text>
            <Text style={styles.upgradeFeature}>• {t('plans:myPlan.planFeatures.premium.proMode')}</Text>
            <Text style={styles.upgradeFeature}>• {t('plans:myPlan.planFeatures.premium.support')}</Text>
            <TouchableOpacity
              style={[styles.upgradeButton, styles.upgradeButtonPremium]}
              onPress={() => handleUpgrade('premium')}
            >
              <Text style={styles.upgradeButtonText}>{t('plans:myPlan.upgradeButtons.upgradeToPremium')}</Text>
            </TouchableOpacity>
            <Text style={styles.upgradeNote}>{t('plans:myPlan.billing.secureCheckout')}</Text>
          </View>
        </View>
      )}

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
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
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
  comparisonSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#1a1b2e',
    borderWidth: 1,
    borderColor: '#24243a',
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#24243a',
  },
  comparisonLabel: {
    flex: 1.2,
    color: '#e5e7eb',
    fontSize: 14,
  },
  comparisonPlan: {
    flex: 0.8,
    color: '#9ca3af',
    fontWeight: '700',
    textAlign: 'center',
  },
  comparisonValue: {
    flex: 0.8,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  trialOffer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: '#3f4180',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trialOfferTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  trialOfferText: {
    color: '#c7d2fe',
    fontSize: 13,
    marginTop: 4,
  },
  trialOfferButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  trialOfferButtonText: {
    color: '#ffffff',
    fontWeight: '700',
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
    backgroundColor: '#1a1b2e',
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
    borderWidth: 1,
    borderColor: '#24243a',
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
  upgradeNote: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 8,
  },
});
