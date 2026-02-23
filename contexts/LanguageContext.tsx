import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useNotifications } from '@/contexts/NotificationContext';
import { initI18n, LanguageCode, setI18nLanguage } from '@/i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isReady, setIsReady] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const initialLanguage = await initI18n();
      if (isMounted) {
        setLanguageState(initialLanguage);
        setIsReady(true);
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = async (nextLanguage: LanguageCode) => {
    if (nextLanguage === language) {
      return;
    }
    setLanguageState(nextLanguage);
    await setI18nLanguage(nextLanguage);
    await addNotification('language', nextLanguage);
  };

  if (!isReady) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
