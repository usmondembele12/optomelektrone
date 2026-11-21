"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

export const LANGUAGES = [
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿', short: 'UZ' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', short: 'RU' },
  { code: 'en', name: 'English', flag: '🇬🇧', short: 'EN' }
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('uz');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('optom_lang');
      if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
        setLangState(saved);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = saved;
        }
      }
    } catch (_) {}

    const handleStorage = (e) => {
      if (e.key === 'optom_lang' && e.newValue) {
        setLangState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setLang = (newLang) => {
    if (newLang !== 'uz' && newLang !== 'ru' && newLang !== 'en') return;
    setLangState(newLang);
    try {
      localStorage.setItem('optom_lang', newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
      }
      window.dispatchEvent(new CustomEvent('optom_lang_change', { detail: newLang }));
    } catch (_) {}
  };

  const t = (key, fallback = '') => {
    const dict = translations[lang] || translations.uz;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to Uzbek if key missing in current language
    if (translations.uz && translations.uz[key] !== undefined) {
      return translations.uz[key];
    }
    return fallback || key;
  };

  const getLocalized = (product, field) => {
    if (!product) return '';

    if (field === 'name') {
      if (lang === 'ru' && product.name_ru) return product.name_ru;
      if (lang === 'en' && product.name_en) return product.name_en;
      return product.name || '';
    }

    if (field === 'categoryName') {
      const catKey = 'cat_' + (product.category || '').replace(/-/g, '_');
      if (translations[lang] && translations[lang][catKey]) {
        return translations[lang][catKey];
      }
      if (lang === 'ru' && product.categoryName_ru) return product.categoryName_ru;
      if (lang === 'en' && product.categoryName_en) return product.categoryName_en;
      return product.categoryName || '';
    }

    if (field === 'unit') {
      const rawUnit = (product.unit || 'dona').toLowerCase();
      if (rawUnit === 'dona' || rawUnit === 'шт' || rawUnit === 'pcs') {
        return t('unitPiece');
      }
      if (rawUnit === 'metr' || rawUnit === 'метр' || rawUnit === 'm') {
        return t('unitMeter');
      }
      if (rawUnit.includes("to'plam") || rawUnit.includes('компл')) {
        return t('unitSet');
      }
      return product.unit || t('unitPiece');
    }

    if (field === 'description') {
      if (lang === 'ru' && product.description_ru) return product.description_ru;
      if (lang === 'en' && product.description_en) return product.description_en;
      return product.description || '';
    }

    if (field === 'specs') {
      if (lang === 'ru' && product.specs_ru) return product.specs_ru;
      if (lang === 'en' && product.specs_en) return product.specs_en;
      return product.specs || {};
    }

    return product[field] || '';
  };

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, getLocalized, languages: LANGUAGES, currentLangObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      lang: 'uz',
      setLang: () => {},
      t: (key, fallback = '') => translations.uz[key] || fallback || key,
      getLocalized: (p, f) => (p ? p[f] || '' : ''),
      languages: LANGUAGES,
      currentLangObj: LANGUAGES[0]
    };
  }
  return context;
}
