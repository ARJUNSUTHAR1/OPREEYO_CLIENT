import React, { createContext, useContext, useState } from 'react';

const ModalCartContext = createContext(undefined);

export const useModalCartContext = () => {
    const context = useContext(ModalCartContext);
    if (!context) {
        throw new Error('useModalCartContext must be used within a ModalCartProvider');
    }
    return context;
};

export const ModalCartProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalCart = () => {
        setIsModalOpen(true);
    };

    const closeModalCart = () => {
        setIsModalOpen(false);
    };

    const contextValue = {
        isModalOpen,
        openModalCart,
        closeModalCart,
    };

    return (
        <ModalCartContext.Provider value={contextValue}>
            {children}
        </ModalCartContext.Provider>
    );
};
