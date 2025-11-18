import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import authEn from './locales/en/auth.json';
import authTr from './locales/tr/auth.json';
import commonEn from './locales/en/common.json';
import commonTr from './locales/tr/common.json';
import plansEn from './locales/en/plans.json';
import plansTr from './locales/tr/plans.json';
import screensEn from './locales/en/screens.json';
import screensTr from './locales/tr/screens.json';

const LANGUAGE_KEY = 'app_language';

const resources = {
  en: {
    translation: {
      auth: authEn,
      common: commonEn,
      plans: plansEn,
      screens: screensEn,
    },
  },
  tr: {
    translation: {
      auth: authTr,
      common: commonTr,
      plans: plansTr,
      screens: screensTr,
    },
  },
};

const getDeviceLanguage = (): string => {
  const locale = Localization.locale;
  // Check if device language starts with 'tr' (Turkish)
  if (locale.startsWith('tr')) {
    return 'tr';
  }
  // Default to English
  return 'en';
};

export const initI18n = async () => {
  try {
    // Try to get saved language preference
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    const initialLanguage = savedLanguage || getDeviceLanguage();

    await i18next
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLanguage,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false, // React already escapes values
        },
        compatibilityJSON: 'v3', // For i18next v21+
      });

    return i18next;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    // Fallback to English if initialization fails
    await i18next
      .use(initReactI18next)
      .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        compatibilityJSON: 'v3',
      });
    return i18next;
  }
};

export const changeLanguage = async (language: string) => {
  try {
    await i18next.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};

export const getCurrentLanguage = () => {
  return i18next.language;
};

export default i18next;
