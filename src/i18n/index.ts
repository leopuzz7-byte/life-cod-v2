import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ruTranslations from './locales/ru.json';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

// Get saved language from localStorage or default to Russian
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('language') || 'ru';
  }
  return 'ru';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ruTranslations },
      en: { translation: enTranslations },
      es: { translation: esTranslations },
    },
    lng: getSavedLanguage(),
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

// Save language to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('language', lng);
  }
});

export default i18n;
