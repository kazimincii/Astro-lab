import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en';
import tr from './locales/tr';

const LANGUAGE_KEY = 'app_language';

// Get device language
const getDeviceLanguage = (): string => {
  const locale = Localization.locale;
  if (locale.startsWith('tr')) return 'tr';
  return 'en';
};

// Get saved language preference or use device language
const getInitialLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || getDeviceLanguage();
  } catch (error) {
    console.error('Error loading saved language:', error);
    return getDeviceLanguage();
  }
};

// Initialize i18next
const initI18n = async () => {
  const initialLanguage = await getInitialLanguage();

  await i18next
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        tr: { translation: tr }
      },
      lng: initialLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // React already escapes values
      },
      react: {
        useSuspense: false
      },
      compatibilityJSON: 'v3' // For React Native compatibility
    });

  return i18next;
};

// Change language and save preference
export const changeLanguage = async (language: string) => {
  try {
    await i18next.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18next.language || 'en';
};

export { initI18n };
export default i18next;
