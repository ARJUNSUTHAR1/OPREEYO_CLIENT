import React from 'react';
import * as Icon from "@phosphor-icons/react";

const StockBadge = ({ product, selectedSize, selectedColor, showIcon = true }) => {

    const getStockInfo = () => {
        if (!product || !product.variation || product.variation.length === 0) {
            return { stock: 0, status: 'unavailable' };
        }

        let totalStock = 0;

        if (selectedSize && selectedColor) {
            const variation = product.variation.find(
                v => v.size === selectedSize && v.color === selectedColor
            );
            totalStock = variation?.stock || 0;
        } else {
            totalStock = product.variation.reduce((sum, v) => sum + (v.stock || 0), 0);
        }

        if (totalStock === 0) return { stock: 0, status: 'outOfStock' };
        if (totalStock <= 5) return { stock: totalStock, status: 'lowStock' };
        if (totalStock <= 20) return { stock: totalStock, status: 'inStock' };
        return { stock: totalStock, status: 'inStock' };
    };

    const stockInfo = getStockInfo();

    const getBadgeStyles = () => {
        switch (stockInfo.status) {
            case 'outOfStock':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'lowStock':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'inStock':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStockText = () => {
        switch (stockInfo.status) {
            case 'outOfStock':
                return 'Out of Stock';
            case 'lowStock':
                return `Low Stock (${stockInfo.stock})`;
            case 'inStock':
                return stockInfo.stock > 20 ? 'In Stock' : `In Stock (${stockInfo.stock})`;
            default:
                return 'N/A';
        }
    };

    const getIcon = () => {
        switch (stockInfo.status) {
            case 'outOfStock':
                return <Icon.XCircle size={14} weight="fill" />;
            case 'lowStock':
                return <Icon.Warning size={14} weight="fill" />;
            case 'inStock':
                return <Icon.CheckCircle size={14} weight="fill" />;
            default:
                return null;
        }
    };

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeStyles()}`}>
            {showIcon && getIcon()}
            <span>{getStockText()}</span>
        </div>
    );
};

export default StockBadge;
