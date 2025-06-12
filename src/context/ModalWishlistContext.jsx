import React, { createContext, useContext, useState } from 'react';

const ModalWishlistContext = createContext(undefined);

export const useModalWishlistContext = () => {
    const context = useContext(ModalWishlistContext);
    if (!context) {
        throw new Error('useModalWishlistContext must be used within a ModalWishlistProvider');
    }
    return context;
};

export const ModalWishlistProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalWishlist = () => {
        setIsModalOpen(true);
    };

    const closeModalWishlist = () => {
        setIsModalOpen(false);
    };

    const contextValue = {
        isModalOpen,
        openModalWishlist,
        closeModalWishlist,
    };

    return (
        <ModalWishlistContext.Provider value={contextValue}>
            {children}
        </ModalWishlistContext.Provider>
    );
};
