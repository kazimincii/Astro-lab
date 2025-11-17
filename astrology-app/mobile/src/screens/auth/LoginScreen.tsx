import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/colors';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.errors.validation'), t('common.errors.tryAgain'));
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      login(response.user, response.accessToken);
    } catch (error: any) {
      Alert.alert(
        t('common.errors.general'),
        error.response?.data?.message || t('auth.login.loginError')
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
      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.login.title')}</Text>

        <TextInput
          style={styles.input}
          placeholder={t('auth.login.emailPlaceholder')}
          placeholderTextColor={colors.cosmic.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder={t('auth.login.passwordPlaceholder')}
          placeholderTextColor={colors.cosmic.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>{t('auth.login.forgotPassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t('auth.login.loggingIn') : t('auth.login.loginButton')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>
            {t('auth.login.noAccount')} {t('auth.login.signUp')}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.cosmic.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.cosmic.card,
    color: colors.cosmic.text,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2d2e3f',
  },
  button: {
    backgroundColor: colors.cosmic.purple,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.cosmic.text,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: colors.cosmic.purple,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: colors.cosmic.purple,
    fontSize: 14,
    fontWeight: '500',
  },
});
