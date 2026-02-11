import { useState, useEffect } from 'react';
import axios from 'axios';

const useStockCheck = () => {
    const [checking, setChecking] = useState(false);

    const checkStockAvailability = async (items) => {
        setChecking(true);
        try {
            const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.post(
                `${BASE_URL}/api/inventory/check-availability`,
                { items }
            );
            setChecking(false);
            return response.data;
        } catch (error) {
            setChecking(false);
            console.error('Stock check error:', error);
            return { available: false, error: error.message };
        }
    };

    const isProductAvailable = (product, size, color, quantity = 1) => {
        if (!product || !product.variation) return false;

        const variation = product.variation.find(
            v => v.size === size && v.color === color
        );

        if (!variation) return false;
        return variation.stock >= quantity;
    };

    const getAvailableQuantity = (product, size, color) => {
        if (!product || !product.variation) return 0;

        const variation = product.variation.find(
            v => v.size === size && v.color === color
        );

        return variation?.stock || 0;
    };

    const getTotalStock = (product) => {
        if (!product || !product.variation) return 0;
        return product.variation.reduce((total, v) => total + (v.stock || 0), 0);
    };

    return {
        checking,
        checkStockAvailability,
        isProductAvailable,
        getAvailableQuantity,
        getTotalStock,
    };
};

export default useStockCheck;
