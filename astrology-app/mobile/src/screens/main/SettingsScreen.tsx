import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/authStore';
import LanguageSelector from '@/components/LanguageSelector';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.settings.title')}</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('screens.settings.account.title')}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('screens.settings.preferences.title')}</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="language" size={20} color={colors.cosmic.purple} />
            <Text style={styles.settingLabel}>{t('screens.settings.preferences.language')}</Text>
          </View>
          <LanguageSelector />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color={colors.cosmic.text} />
        <Text style={styles.logoutText}>{t('auth.login.loginButton')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.bg,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.cosmic.text,
  },
  section: {
    backgroundColor: colors.cosmic.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cosmic.textSecondary,
    marginBottom: 16,
  },
  email: {
    fontSize: 18,
    color: colors.cosmic.text,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.cosmic.text,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    margin: 16,
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: colors.cosmic.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
