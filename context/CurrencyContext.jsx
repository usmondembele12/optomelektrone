"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const CURRENCIES = [
  { code: 'UZS', symbol: "so'm", label: "SO'M", short: "SO'M", name: "O'zbek so'mi", flag: '🇺🇿' },
  { code: 'USD', symbol: '$', label: 'USD ($)', short: 'USD $', name: 'AQSH Dollari', flag: '🇺🇸' }
];

export const DEFAULT_USD_RATE = 12850;

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState('UZS');
  const [usdRate, setUsdRateState] = useState(DEFAULT_USD_RATE);

  useEffect(() => {
    // 1. Read persisted currency from localStorage
    try {
      const saved = localStorage.getItem('optom_currency');
      if (saved === 'USD' || saved === 'UZS') {
        setCurrencyState(saved);
      }
    } catch (_) {}

    // 2. Fetch live dollar rate from /api/settings
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.usdRate && Number(data.usdRate) > 0) {
            setUsdRateState(Number(data.usdRate));
          }
        }
      } catch (_) {}
    };

    fetchSettings();

    // 3. Listen to cross-tab storage changes
    const handleStorage = (e) => {
      if (e.key === 'optom_currency' && (e.newValue === 'USD' || e.newValue === 'UZS')) {
        setCurrencyState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setCurrency = (newCurr) => {
    if (newCurr !== 'USD' && newCurr !== 'UZS') return;
    setCurrencyState(newCurr);
    try {
      localStorage.setItem('optom_currency', newCurr);
      window.dispatchEvent(new CustomEvent('optom_currency_change', { detail: newCurr }));
    } catch (_) {}
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'UZS' ? 'USD' : 'UZS');
  };

  const formatPrice = useCallback((amountInUzs, options = {}) => {
    const num = Number(amountInUzs) || 0;
    const targetCurrency = options.currency || currency;
    const showSymbol = options.showSymbol !== false;

    if (targetCurrency === 'USD') {
      const usdValue = num / usdRate;
      const formatted = usdValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return showSymbol ? `$ ${formatted}` : formatted;
    } else {
      const formatted = Math.round(num).toLocaleString('uz-UZ');
      const symbol = options.symbol || "so'm";
      return showSymbol ? `${formatted} ${symbol}` : formatted;
    }
  }, [currency, usdRate]);

  const formatSecondaryPrice = useCallback((amountInUzs) => {
    const num = Number(amountInUzs) || 0;
    if (num <= 0) return '';
    if (currency === 'USD') {
      return `≈ ${Math.round(num).toLocaleString('uz-UZ')} so'm`;
    } else {
      const usdValue = num / usdRate;
      const formatted = usdValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return `≈ $ ${formatted}`;
    }
  }, [currency, usdRate]);

  const convertPrice = useCallback((amountInUzs, targetCurrency = currency) => {
    const num = Number(amountInUzs) || 0;
    if (targetCurrency === 'USD') {
      const val = num / usdRate;
      return {
        value: val,
        raw: val,
        symbol: '$',
        currency: 'USD',
        formatted: `$ ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      };
    }
    return {
      value: num,
      raw: num,
      symbol: "so'm",
      currency: 'UZS',
      formatted: `${Math.round(num).toLocaleString('uz-UZ')} so'm`
    };
  }, [currency, usdRate]);

  const currentCurrencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      toggleCurrency,
      usdRate,
      setUsdRate: setUsdRateState,
      formatPrice,
      formatSecondaryPrice,
      convertPrice,
      currencies: CURRENCIES,
      currentCurrencyObj
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'UZS',
      setCurrency: () => {},
      toggleCurrency: () => {},
      usdRate: DEFAULT_USD_RATE,
      setUsdRate: () => {},
      formatPrice: (amount) => `${Number(amount || 0).toLocaleString('uz-UZ')} so'm`,
      formatSecondaryPrice: () => '',
      convertPrice: (amount) => ({
        value: Number(amount || 0),
        raw: Number(amount || 0),
        symbol: "so'm",
        currency: 'UZS',
        formatted: `${Number(amount || 0).toLocaleString('uz-UZ')} so'm`
      }),
      currencies: CURRENCIES,
      currentCurrencyObj: CURRENCIES[0]
    };
  }
  return context;
}
