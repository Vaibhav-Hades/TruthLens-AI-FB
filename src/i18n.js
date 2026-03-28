// TRANSLATION RULE: Every visible string in JSX must use t('key')
// When adding any new feature or page:
// 1. Add the key to en.json first
// 2. Add accurate native translations to hi.json, te.json, ta.json, bn.json
// 3. Never hardcode English strings in JSX
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';
import translationTE from './locales/te/translation.json';
import translationTA from './locales/ta/translation.json';
import translationBN from './locales/bn/translation.json';

const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
  te: { translation: translationTE },
  ta: { translation: translationTA },
  bn: { translation: translationBN }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'htmlTag', 'cookie', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
