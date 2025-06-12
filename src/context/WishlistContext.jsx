import React, { createContext, useContext, useReducer } from 'react';

// This assumes each product has at least an 'id' property
// and other useful fields like name, image, price, etc.

const WishlistContext = createContext(undefined);

const initialState = {
  wishlistArray: []
};

const WishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlistArray: [...state.wishlistArray, { ...action.payload }],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlistArray: state.wishlistArray.filter(item => item.id !== action.payload),
      };
    case 'LOAD_WISHLIST':
      return {
        ...state,
        wishlistArray: action.payload,
      };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlistState, dispatch] = useReducer(WishlistReducer, initialState);

  const addToWishlist = (item) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
  };

  const removeFromWishlist = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemId });
  };

  return (
    <WishlistContext.Provider value={{ wishlistState, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
