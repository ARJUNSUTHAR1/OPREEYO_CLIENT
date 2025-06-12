import React, { createContext, useContext, useState } from 'react';

const ModalSearchContext = createContext(undefined);

export const useModalSearchContext = () => {
    const context = useContext(ModalSearchContext);
    if (!context) {
        throw new Error('useModalSearchContext must be used within a ModalSearchProvider');
    }
    return context;
};

export const ModalSearchProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalSearch = () => {
        setIsModalOpen(true);
    };

    const closeModalSearch = () => {
        setIsModalOpen(false);
    };

    const contextValue = {
        isModalOpen,
        openModalSearch,
        closeModalSearch,
    };

    return (
        <ModalSearchContext.Provider value={contextValue}>
            {children}
        </ModalSearchContext.Provider>
    );
};
