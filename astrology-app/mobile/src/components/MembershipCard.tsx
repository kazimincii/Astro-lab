import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

interface MembershipCardProps {
  planType: 'basic' | 'standard' | 'premium';
  price?: string;
  features: string[];
  isCurrentPlan?: boolean;
  onSelect?: () => void;
  trialAvailable?: boolean;
}

export default function MembershipCard({
  planType,
  price,
  features,
  isCurrentPlan = false,
  onSelect,
  trialAvailable = false,
}: MembershipCardProps) {
  const getGradientColors = () => {
    switch (planType) {
      case 'premium':
        return ['#fbbf24', '#f59e0b', '#6366f1'] as const;
      case 'standard':
        return ['#6366f1', '#8b5cf6'] as const;
      case 'basic':
      default:
        return ['#1a1a2e', '#2d2e3f'] as const;
    }
  };

  const getBorderColor = () => {
    switch (planType) {
      case 'premium':
        return '#fbbf24';
      case 'standard':
        return '#6366f1';
      case 'basic':
      default:
        return '#374151';
    }
  };

  const getPlanName = () => planType.charAt(0).toUpperCase() + planType.slice(1);

  const getPlanEmoji = () => {
    switch (planType) {
      case 'premium':
        return '✨';
      case 'standard':
        return '⭐';
      case 'basic':
      default:
        return '🌙';
    }
  };

  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={isCurrentPlan}
      activeOpacity={0.8}
      style={[styles.container, planType === 'premium' && styles.premiumContainer]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          { borderColor: getBorderColor() },
          planType === 'premium' && styles.premiumGlow,
        ]}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>{getPlanEmoji()}</Text>
            <Text style={[styles.planName, planType === 'premium' && styles.premiumText]}>
              {getPlanName()}
            </Text>
          </View>

          {isCurrentPlan && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Current Plan</Text>
            </View>
          )}
        </View>

        {price && (
          <View style={styles.priceContainer}>
            <Text style={[styles.price, planType === 'premium' && styles.premiumText]}>
              {price}
            </Text>
            {trialAvailable && <Text style={styles.trialText}>7-day free trial</Text>}
          </View>
        )}

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text
                style={[
                  styles.featureText,
                  planType === 'premium' && styles.premiumFeatureText,
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={onSelect}
          disabled={isCurrentPlan}
          style={[
            styles.selectButton,
            planType === 'premium' && styles.premiumButton,
            isCurrentPlan && styles.currentButton,
          ]}
        >
          <Text
            style={[
              styles.selectButtonText,
              planType === 'premium' && styles.premiumButtonText,
            ]}
          >
            {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  premiumContainer: {
    shadowColor: '#fbbf24',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  gradient: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2d2e3f',
  },
  premiumGlow: {
    shadowColor: '#fbbf24',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 22,
  },
  planName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.cosmic.text,
  },
  premiumText: {
    color: '#000000',
  },
  currentBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  priceContainer: {
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.cosmic.text,
    marginBottom: 4,
  },
  trialText: {
    fontSize: 14,
    color: colors.cosmic.accent,
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    color: '#10b981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: colors.cosmic.text,
    flex: 1,
  },
  premiumFeatureText: {
    color: '#1a1a2e',
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: colors.cosmic.purple,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  premiumButton: {
    backgroundColor: '#000000',
  },
  currentButton: {
    opacity: 0.7,
  },
  selectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumButtonText: {
    color: '#fbbf24',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
});
