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
        return ['#fbbf24', '#f59e0b', '#6366f1'];
      case 'standard':
        return ['#6366f1', '#8b5cf6'];
      case 'basic':
      default:
        return ['#1a1a2e', '#2d2e3f'];
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

  const getPlanName = () => {
    return planType.charAt(0).toUpperCase() + planType.slice(1);
  };

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
      style={[
        styles.container,
        planType === 'premium' && styles.premiumContainer,
      ]}
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>{getPlanEmoji()}</Text>
            <Text style={[
              styles.planName,
              planType === 'premium' && styles.premiumText
            ]}>
              {getPlanName()}
            </Text>
          </View>

          {isCurrentPlan && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Current Plan</Text>
            </View>
          )}
        </View>

        {/* Price */}
        {price && (
          <View style={styles.priceContainer}>
            <Text style={[
              styles.price,
              planType === 'premium' && styles.premiumText
            ]}>
              {price}
            </Text>
            {trialAvailable && (
              <Text style={styles.trialText}>7-day free trial</Text>
            )}
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={[
                styles.featureText,
                planType === 'premium' && styles.premiumFeatureText
              ]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        {!isCurrentPlan && onSelect && (
          <TouchableOpacity
            style={[
              styles.selectButton,
              planType === 'premium' && styles.premiumButton,
            ]}
            onPress={onSelect}
          >
            <Text style={[
              styles.selectButtonText,
              planType === 'premium' && styles.premiumButtonText,
            ]}>
              {trialAvailable ? 'Start Free Trial' : 'Select Plan'}
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Premium Shimmer Effect */}
      {planType === 'premium' && (
        <LinearGradient
          colors={['transparent', 'rgba(251, 191, 36, 0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  premiumContainer: {
    transform: [{ scale: 1.02 }],
  },
  gradient: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
  },
  premiumGlow: {
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginRight: 8,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.cosmic.text,
  },
  premiumText: {
    color: '#000000',
  },
  currentBadge: {
    backgroundColor: colors.cosmic.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    marginBottom: 20,
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
