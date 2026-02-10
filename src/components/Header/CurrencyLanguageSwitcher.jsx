import React from 'react';
import useCurrencyStore from '../../store/currencyStore';

const CurrencyLanguageSwitcher = () => {
    const { currency, setCurrency } = useCurrencyStore();

    return (
        <div className="flex items-center">
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-2 py-1 text-sm border border-line rounded bg-white cursor-pointer hover:border-black transition-colors max-md:text-xs max-md:px-1 max-md:py-0.5"
            >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
            </select>
        </div>
    );
};

export default CurrencyLanguageSwitcher;
