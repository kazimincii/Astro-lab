import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/colors';
import { authApi } from '@/api/auth';

export default function RegisterScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert(
        t('common.errors.validation'),
        t('auth.register.validation.emailRequired')
      );
      return;
    }

    setLoading(true);
    try {
      await authApi.register({ email, password, firstName, lastName });
      Alert.alert(
        t('common.messages.success'),
        t('auth.register.success'),
        [{ text: t('common.buttons.ok'), onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert(
        t('common.errors.general'),
        error.response?.data?.message || t('auth.register.error')
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
        <Text style={styles.title}>{t('auth.register.title')}</Text>

        <TextInput
          style={styles.input}
          placeholder={t('auth.register.firstNamePlaceholder')}
          placeholderTextColor={colors.cosmic.textSecondary}
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder={t('auth.register.lastNamePlaceholder')}
          placeholderTextColor={colors.cosmic.textSecondary}
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder={t('auth.register.emailPlaceholder')}
          placeholderTextColor={colors.cosmic.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder={t('auth.register.passwordPlaceholder')}
          placeholderTextColor={colors.cosmic.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t('auth.register.creating') : t('auth.register.signUpButton')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            {t('auth.register.alreadyHaveAccount')} {t('auth.register.login')}
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
});
