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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleUpgrade = () => {
    onClose();
    navigation.navigate('MyPlan' as never);
  };

  const getUpgradeMessage = () => {
    if (currentPlan === 'basic') {
      return {
        title: t('plans.actionLimit.title'),
        message: t('plans.actionLimit.subtitle'),
        benefits: [
          t('plans.standard.price') + ': 20 ' + t('plans.actionLimit.remaining', { count: 20 }),
          t('plans.premiumPlan.price') + ': ' + t('plans.premiumPlan.features.actions'),
        ],
      };
    } else if (currentPlan === 'standard') {
      return {
        title: t('plans.actionLimit.title'),
        message: t('plans.actionLimit.subtitle'),
        benefits: [
          t('plans.premiumPlan.features.actions'),
          t('plans.premiumPlan.features.allCharts'),
          t('plans.premiumPlan.features.allForecasts'),
        ],
      };
    }
    return {
      title: t('plans.actionLimit.title'),
      message: t('plans.actionLimit.tryTomorrow'),
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
              <Text style={styles.benefitsTitle}>{t('plans.upgradeModal.benefits.title')}</Text>
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
                      ? t('plans.plans.viewPlans')
                      : t('plans.actionLimit.upgradeNow')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>
                {currentPlan === 'premium' ? t('common.buttons.ok') : t('auth.permissions.notification.skip')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reset Info */}
          <Text style={styles.resetInfo}>
            {t('plans.actionLimit.resetTime')}
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
