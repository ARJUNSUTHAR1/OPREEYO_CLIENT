import React from 'react';
import useCurrencyStore from '../../store/currencyStore';

const PriceDisplay = ({ price, originPrice, className = "" }) => {
    const { formatPrice, convertPrice } = useCurrencyStore();

    const hasDiscount = originPrice && originPrice > price;

    return (
        <div className={`price-display flex items-center gap-2 ${className}`}>
            <div className="current-price text-title font-bold">
                {formatPrice(price)}
            </div>
            {hasDiscount && (
                <>
                    <div className="original-price text-secondary line-through text-sm">
                        {formatPrice(originPrice)}
                    </div>
                    <div className="discount-badge bg-red-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        -{Math.round(((originPrice - price) / originPrice) * 100)}%
                    </div>
                </>
            )}
        </div>
    );
};

export default PriceDisplay;
