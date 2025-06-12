import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  compareArray: []
};

// Reducer function
const CompareReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        compareArray: [...state.compareArray, { ...action.payload }],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        compareArray: state.compareArray.filter(item => item.id !== action.payload),
      };
    case 'LOAD_WISHLIST':
      return {
        ...state,
        compareArray: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const CompareContext = createContext(undefined);

// Provider
export const CompareProvider = ({ children }) => {
  const [compareState, dispatch] = useReducer(CompareReducer, initialState);

  const addToCompare = (item) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
  };

  const removeFromCompare = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemId });
  };

  return (
    <CompareContext.Provider value={{ compareState, addToCompare, removeFromCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

// Hook
export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
