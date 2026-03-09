import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from '@/i18n/resources';

export type LanguageCode = 'en' | 'fr';

export const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'fr'];

const LANGUAGE_STORAGE_KEY = 'nextmanga_language';

const getDeviceLanguage = (): LanguageCode => {
  const locale = Localization.getLocales()[0];
  const languageCode = locale?.languageCode?.toLowerCase();

  if (languageCode === 'fr' || languageCode === 'en') {
    return languageCode;
  }

  return 'en';
};

export const initI18n = async (): Promise<LanguageCode> => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  const initialLanguage: LanguageCode =
    savedLanguage === 'fr' || savedLanguage === 'en' ? savedLanguage : getDeviceLanguage();

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      supportedLngs: SUPPORTED_LANGUAGES,
      interpolation: {
        escapeValue: false,
      },
    });
  } else if (i18n.language !== initialLanguage) {
    await i18n.changeLanguage(initialLanguage);
  }

  return initialLanguage;
};

export const setI18nLanguage = async (language: LanguageCode) => {
  if (i18n.language !== language) {
    await i18n.changeLanguage(language);
  }

  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export default i18n;
