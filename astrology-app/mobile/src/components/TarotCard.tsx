import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

interface TarotCardProps {
  cardName?: string;
  cardMeaning?: string;
  isReversed?: boolean;
  isFlipped?: boolean;
  onFlip?: () => void;
  disabled?: boolean;
}

export default function TarotCard({
  cardName = 'The Star',
  cardMeaning = 'Hope, faith, purpose, renewal, spirituality',
  isReversed = false,
  isFlipped = false,
  onFlip,
  disabled = false,
}: TarotCardProps) {
  const [flipAnim] = useState(new Animated.Value(isFlipped ? 180 : 0));

  const handleFlip = () => {
    if (disabled || !onFlip) return;

    const toValue = isFlipped ? 0 : 180;

    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    onFlip();
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <TouchableOpacity
      onPress={handleFlip}
      disabled={disabled}
      activeOpacity={0.9}
      style={styles.container}
    >
      {/* Card Back (Face Down) */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          {
            transform: [{ rotateY: backInterpolate }],
            opacity: backOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={['#1a1a2e', '#6366f1', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardBackGradient}
        >
          {/* Cosmic Pattern */}
          <View style={styles.pattern}>
            <Text style={styles.patternText}>⭐</Text>
            <Text style={styles.patternText}>✨</Text>
            <Text style={styles.patternText}>🌙</Text>
            <Text style={styles.patternText}>☀️</Text>
            <Text style={styles.patternText}>⭐</Text>
          </View>

          <Text style={styles.backTitle}>TAROT</Text>

          <View style={styles.pattern}>
            <Text style={styles.patternText}>✨</Text>
            <Text style={styles.patternText}>⭐</Text>
            <Text style={styles.patternText}>☀️</Text>
            <Text style={styles.patternText}>🌙</Text>
            <Text style={styles.patternText}>✨</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Card Front (Face Up) */}
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          {
            transform: [{ rotateY: frontInterpolate }],
            opacity: frontOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={['#f5f5f5', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.cardFrontGradient}
        >
          {/* Card Border */}
          <View style={styles.cardBorder}>
            {/* Card Content */}
            <View style={styles.cardContent}>
              {/* Card Image Placeholder */}
              <View style={styles.cardImage}>
                <Text style={styles.cardEmoji}>⭐</Text>
              </View>

              {/* Card Name */}
              <Text style={[
                styles.cardName,
                isReversed && styles.reversedText,
              ]}>
                {cardName}
              </Text>

              {/* Reversed Indicator */}
              {isReversed && (
                <View style={styles.reversedBadge}>
                  <Text style={styles.reversedBadgeText}>↓ Reversed</Text>
                </View>
              )}

              {/* Card Meaning */}
              <Text style={styles.cardMeaning} numberOfLines={2}>
                {cardMeaning}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Glow Effect */}
      {isFlipped && (
        <View style={styles.glow} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 240,
    margin: 8,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardBack: {
    // No additional styles needed
  },
  cardFront: {
    // No additional styles needed
  },
  cardBackGradient: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.cosmic.purple,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pattern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  patternText: {
    fontSize: 16,
    opacity: 0.6,
  },
  backTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
    transform: [{ rotate: '0deg' }],
  },
  cardFrontGradient: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.cosmic.purple,
    padding: 4,
  },
  cardBorder: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6366f1',
    backgroundColor: '#ffffff',
    padding: 12,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  cardEmoji: {
    fontSize: 48,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginTop: 8,
  },
  reversedText: {
    color: '#ef4444',
  },
  reversedBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  reversedBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardMeaning: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 8,
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.cosmic.accent,
    shadowColor: colors.cosmic.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
});
