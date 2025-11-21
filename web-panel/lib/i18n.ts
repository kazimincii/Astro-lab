import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import locale files
import enAuth from '@/locales/en/auth.json';
import enCommon from '@/locales/en/common.json';
import enScreens from '@/locales/en/screens.json';
import enPlans from '@/locales/en/plans.json';

import trAuth from '@/locales/tr/auth.json';
import trCommon from '@/locales/tr/common.json';
import trScreens from '@/locales/tr/screens.json';
import trPlans from '@/locales/tr/plans.json';

const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    screens: enScreens,
    plans: enPlans,
  },
  tr: {
    auth: trAuth,
    common: trCommon,
    screens: trScreens,
    plans: trPlans,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
