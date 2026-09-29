import en from './en.json';
import hi from './hi.json';
import gu from './gu.json';
import { createContext, useContext, useEffect, useState } from 'react';

export const languages = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
];

const translations = { en, hi, gu };
const STORAGE_KEY = 'agrisense-language';
const getValue = (source, path) => path.split('.').reduce((value, key) => value?.[key], source);

export function translate(language, key, variables = {}) {
  const value = getValue(translations[language], key) ?? getValue(translations.en, key) ?? key;
  return Object.entries(variables).reduce((result, [name, replacement]) => result.replace(`{{${name}}}`, replacement), value);
}

export function getStoredLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return translations[saved] ? saved : 'en';
}

export function storeLanguage(language) {
  if (translations[language]) localStorage.setItem(STORAGE_KEY, language);
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage);
  const setLanguage = (nextLanguage) => {
    if (!translations[nextLanguage]) return;
    setLanguageState(nextLanguage);
    storeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
  };
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: (key, variables) => translate(language, key, variables), languages }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
