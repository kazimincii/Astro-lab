import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentLanguage === 'en' && styles.activeButton]}
        onPress={() => handleLanguageChange('en')}
      >
        <Text style={[styles.buttonText, currentLanguage === 'en' && styles.activeText]}>
          English
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, currentLanguage === 'tr' && styles.activeButton]}
        onPress={() => handleLanguageChange('tr')}
      >
        <Text style={[styles.buttonText, currentLanguage === 'tr' && styles.activeText]}>
          Türkçe
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333'
  },
  activeButton: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6'
  },
  buttonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600'
  },
  activeText: {
    color: '#fff'
  }
});

export default LanguageSelector;
