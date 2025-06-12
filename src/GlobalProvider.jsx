import React from 'react'
import { CartProvider } from './context/CartContext'
import { ModalCartProvider } from './context/ModalCartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ModalWishlistProvider } from './context/ModalWishlistContext'
import { CompareProvider } from './context/CompareContext'
import { ModalCompareProvider } from './context/ModalCompareContext'
import { ModalSearchProvider } from './context/ModalSearchContext'
import { ModalQuickviewProvider } from './context/ModalQuickviewContext'
import { BrowserRouter } from 'react-router-dom';


const GlobalProvider = ({ children }) => {
    return (
        <BrowserRouter>
            <CartProvider>
                <ModalCartProvider>
                    <WishlistProvider>
                        <ModalWishlistProvider>
                            <CompareProvider>
                                <ModalCompareProvider>
                                    <ModalSearchProvider>
                                        <ModalQuickviewProvider>
                                            {children}
                                        </ModalQuickviewProvider>
                                    </ModalSearchProvider>
                                </ModalCompareProvider>
                            </CompareProvider>
                        </ModalWishlistProvider>
                    </WishlistProvider>
                </ModalCartProvider>
            </CartProvider>
        </BrowserRouter>
    )
}

export default GlobalProvider