import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface ActionLimitModalProps {
  visible: boolean;
  onClose: () => void;
  currentPlan: 'basic' | 'standard' | 'premium';
  actionsUsed: number;
  dailyLimit: number;
}

export default function ActionLimitModal({
  visible,
  onClose,
  currentPlan,
  actionsUsed,
  dailyLimit,
}: ActionLimitModalProps) {
  const navigation = useNavigation();

  const handleUpgrade = () => {
    onClose();
    navigation.navigate('MyPlan' as never);
  };

  const getUpgradeMessage = () => {
    if (currentPlan === 'basic') {
      return {
        title: "You've used all your daily actions",
        message: `You've used ${actionsUsed} out of ${dailyLimit} free actions today.`,
        benefits: [
          'Standard: 4 actions/day for $10/month',
          'Premium: UNLIMITED actions for $19/month',
        ],
      };
    } else if (currentPlan === 'standard') {
      return {
        title: "You've reached your daily limit",
        message: `You've used all ${dailyLimit} actions today.`,
        benefits: [
          'Premium: UNLIMITED actions',
          'Pro mode interpretations',
          'Up to 50 profiles',
        ],
      };
    }
    return {
      title: 'Daily limit reached',
      message: 'Come back tomorrow for more actions!',
      benefits: [],
    };
  };

  const { title, message, benefits } = getUpgradeMessage();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⚡</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Benefits */}
          {benefits.length > 0 && (
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Upgrade to get:</Text>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {currentPlan !== 'premium' && benefits.length > 0 && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.upgradeButtonText}>
                    {currentPlan === 'basic'
                      ? 'View Plans'
                      : 'Upgrade to Premium'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>
                {currentPlan === 'premium' ? 'OK' : 'Maybe Later'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reset Info */}
          <Text style={styles.resetInfo}>
            Your actions will reset tomorrow at midnight
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2a2a4e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: '#0f0f1e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  benefitsTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  benefitText: {
    color: '#d1d5db',
    fontSize: 14,
    flex: 1,
  },
  actionsContainer: {
    width: '100%',
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  resetInfo: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
