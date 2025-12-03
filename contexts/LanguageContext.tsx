
import React, { createContext, useContext, ReactNode } from 'react';
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

  const setLanguage = (lang: Language) => {
    dispatch(setReduxLanguage(lang));
  };

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
