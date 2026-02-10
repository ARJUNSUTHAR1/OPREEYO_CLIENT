import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const exchangeRates = {
  USD: 1,
  INR: 83.12,
};

const currencySymbols = {
  USD: '$',
  INR: '₹',
};

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'INR',

      setCurrency: (newCurrency) => set({ currency: newCurrency }),

      convertPrice: (price, fromCurrency = 'INR') => {
        const { currency } = get();
        const numPrice = Number(price);
        if (!numPrice || isNaN(numPrice)) return 0;
        if (!fromCurrency) fromCurrency = 'INR';
        if (fromCurrency === currency) return Math.round(numPrice * 100) / 100;

        // Convert to USD first (base currency), then to target
        const fromRate = exchangeRates[fromCurrency] || 1;
        const toRate = exchangeRates[currency] || 1;
        const priceInUSD = numPrice / fromRate;
        const convertedPrice = priceInUSD * toRate;

        return Math.round(convertedPrice * 100) / 100;
      },

      formatPrice: (price, fromCurrency = 'INR') => {
        const { currency, convertPrice } = get();
        const numPrice = Number(price);
        if (!numPrice || isNaN(numPrice)) return `${currencySymbols[currency] || '₹'}0.00`;
        const converted = convertPrice(numPrice, fromCurrency);
        const symbol = currencySymbols[currency] || '₹';
        return `${symbol}${converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },

      getCurrencySymbol: () => {
        const { currency } = get();
        return currencySymbols[currency] || '₹';
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);

export default useCurrencyStore;
