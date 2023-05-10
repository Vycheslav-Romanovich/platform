import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import translationDE from '../public/locales/de/translation.json';
import translationEN from '../public/locales/en/translation.json';
import translationES from '../public/locales/es/translation.json';
import translationRU from '../public/locales/ru/translation.json';
import translationZN from '../public/locales/zh/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
  ru: {
    translation: translationRU,
  },
  es: {
    translation: translationES,
  },
  zh: {
    translation: translationZN,
  },
};

const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  resources,
  detection: DETECTION_OPTIONS,
  fallbackLng: 'en',
});

export default i18n;
