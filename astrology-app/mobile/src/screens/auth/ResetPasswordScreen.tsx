import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/colors';
import { authApi } from '@/api/auth';

export default function ResetPasswordScreen({ route, navigation }: any) {
  const { t } = useTranslation();
  const { token } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert(t('common.errors.required'), t('auth.resetPassword.errors.allFields'));
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(t('common.errors.required'), t('auth.resetPassword.errors.minLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.errors.required'), t('auth.resetPassword.errors.mismatch'));
      return;
    }

    if (!token) {
      Alert.alert(t('common.errors.required'), t('auth.resetPassword.errors.invalidToken'));
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      Alert.alert(
        t('common.messages.success'),
        t('auth.resetPassword.success'),
        [
          {
            text: t('common.buttons.ok'),
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        t('common.errors.required'),
        error.response?.data?.message || t('auth.resetPassword.errors.resetFailed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.cosmic.bg, colors.cosmic.card]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{t('auth.resetPassword.title')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.resetPassword.subtitle')}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('auth.resetPassword.newPassword')}
            placeholderTextColor={colors.cosmic.textSecondary}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder={t('auth.resetPassword.confirmPassword')}
            placeholderTextColor={colors.cosmic.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementText}>
              {t('auth.resetPassword.requirements.minLength')}
            </Text>
            <Text style={styles.requirementText}>
              {t('auth.resetPassword.requirements.uppercase')}
            </Text>
            <Text style={styles.requirementText}>
              {t('auth.resetPassword.requirements.number')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.resetButton')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.backButton}
          >
            <Text style={styles.link}>{t('auth.resetPassword.backToLogin')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.cosmic.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.cosmic.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: colors.cosmic.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  passwordRequirements: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  requirementText: {
    color: colors.cosmic.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  button: {
    backgroundColor: colors.cosmic.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: colors.cosmic.accent,
    fontSize: 14,
    fontWeight: '500',
  },
});
