import React, { createContext, useContext, useState } from 'react';

const ModalCompareContext = createContext();

export const useModalCompareContext = () => {
  const context = useContext(ModalCompareContext);
  if (!context) {
    throw new Error('useModalCompareContext must be used within a ModalCompareProvider');
  }
  return context;
};

export const ModalCompareProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalCompare = () => {
    setIsModalOpen(true);
  };

  const closeModalCompare = () => {
    setIsModalOpen(false);
  };

  const contextValue = {
    isModalOpen,
    openModalCompare,
    closeModalCompare,
  };

  return (
    <ModalCompareContext.Provider value={contextValue}>
      {children}
    </ModalCompareContext.Provider>
  );
};
