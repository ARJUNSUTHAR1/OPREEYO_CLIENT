// CartContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(undefined);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const newItem = { ...action.payload, quantity: 1, selectedSize: '', selectedColor: '' };
            return {
                ...state,
                cartArray: [...state.cartArray, newItem],
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartArray: state.cartArray.filter((item) => item.id !== action.payload),
            };
        case 'UPDATE_CART':
            return {
                ...state,
                cartArray: state.cartArray.map((item) =>
                    item.id === action.payload.itemId
                        ? {
                            ...item,
                            quantity: action.payload.quantity,
                            selectedSize: action.payload.selectedSize,
                            selectedColor: action.payload.selectedColor,
                        }
                        : item
                ),
            };
        case 'LOAD_CART':
            return {
                ...state,
                cartArray: action.payload,
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, { cartArray: [] });

    const addToCart = (item) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
    };

    const removeFromCart = (itemId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    };

    const updateCart = (itemId, quantity, selectedSize, selectedColor) => {
        dispatch({
            type: 'UPDATE_CART',
            payload: { itemId, quantity, selectedSize, selectedColor },
        });
    };

    return (
        <CartContext.Provider value={{ cartState, addToCart, removeFromCart, updateCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
