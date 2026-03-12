
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setLanguage as setReduxLanguage } from '../store/slices/settingsSlice';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.de;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const language = useAppSelector(state => state.settings.language);
  const dispatch = useAppDispatch();

  // Sync <html lang> attribute for screen readers (WCAG 3.1.1)
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    dispatch(setReduxLanguage(lang));
  };

  const value = {
    language,
    setLanguage,
    t: translations[language as keyof typeof translations]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
