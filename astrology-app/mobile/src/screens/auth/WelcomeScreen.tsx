import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/colors';

export default function WelcomeScreen({ navigation }: any) {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={[colors.cosmic.bg, colors.cosmic.purple]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.welcome.appTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>{t('auth.welcome.loginButton')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>{t('auth.welcome.signUpButton')}</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.cosmic.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.cosmic.textSecondary,
    marginBottom: 60,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.cosmic.purple,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.cosmic.purple,
  },
  buttonText: {
    color: colors.cosmic.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
