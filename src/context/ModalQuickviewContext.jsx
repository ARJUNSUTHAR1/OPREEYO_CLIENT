import React, { createContext, useContext, useState } from 'react';

const ModalQuickviewContext = createContext();

export const ModalQuickviewProvider = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openQuickview = (product) => {
    setSelectedProduct(product);
  };

  const closeQuickview = () => {
    setSelectedProduct(null);
  };

  return (
    <ModalQuickviewContext.Provider value={{ selectedProduct, openQuickview, closeQuickview }}>
      {children}
    </ModalQuickviewContext.Provider>
  );
};

export const useModalQuickviewContext = () => {
  const context = useContext(ModalQuickviewContext);
  if (!context) {
    throw new Error('useModalQuickviewContext must be used within a ModalQuickviewProvider');
  }
  return context;
};
