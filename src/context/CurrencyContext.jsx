import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Currency data with symbols and conversion rates (base: USD)
const currencies = {
  USD: {
    symbol: '$',
    name: 'US Dollar',
    rate: 1,
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    rate: 0.92,
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
    rate: 0.79,
  },
  INR: {
    symbol: '₹',
    name: 'Indian Rupee',
    rate: 83.12,
  },
  JPY: {
    symbol: '¥',
    name: 'Japanese Yen',
    rate: 149.50,
  },
  CAD: {
    symbol: 'C$',
    name: 'Canadian Dollar',
    rate: 1.36,
  },
  AUD: {
    symbol: 'A$',
    name: 'Australian Dollar',
    rate: 1.53,
  },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const changeCurrency = (newCurrency) => {
    if (currencies[newCurrency]) {
      setCurrency(newCurrency);
    }
  };

  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD) => {
    const rate = currencies[currency]?.rate || 1;
    return (priceInUSD * rate).toFixed(2);
  };

  // Format price with currency symbol
  const formatPrice = (priceInUSD) => {
    const convertedPrice = convertPrice(priceInUSD);
    const symbol = currencies[currency]?.symbol || '$';
    return `${symbol}${convertedPrice}`;
  };

  // Get current currency info
  const getCurrencyInfo = () => {
    return currencies[currency] || currencies.USD;
  };

  // Get all available currencies
  const getAvailableCurrencies = () => {
    return Object.keys(currencies).map(code => ({
      code,
      ...currencies[code],
    }));
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        convertPrice,
        formatPrice,
        getCurrencyInfo,
        getAvailableCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
