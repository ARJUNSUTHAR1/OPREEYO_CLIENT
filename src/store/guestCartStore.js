import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGuestCartStore = create(
  persist(
    (set, get) => ({
      guestCart: [],

      addToGuestCart: (product, selectedSize, selectedColor) => {
        const { guestCart } = get();
        
        const existingItem = guestCart.find(
          item => item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
        );

        if (existingItem) {
          set({
            guestCart: guestCart.map(item =>
              item.id === product.id && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          const newItem = {
            ...product,
            quantity: 1,
            selectedSize: selectedSize || product.variation?.[0]?.size || 'M',
            selectedColor: selectedColor || product.variation?.[0]?.color || 'Black',
          };
          set({ guestCart: [...guestCart, newItem] });
        }
      },

      removeFromGuestCart: (itemId) => {
        set({
          guestCart: get().guestCart.filter(item => item.id !== itemId)
        });
      },

      updateGuestCart: (itemId, quantity, selectedSize, selectedColor) => {
        set({
          guestCart: get().guestCart.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: Math.max(1, quantity),
                  selectedSize: selectedSize || item.selectedSize,
                  selectedColor: selectedColor || item.selectedColor,
                }
              : item
          )
        });
      },

      clearGuestCart: () => {
        set({ guestCart: [] });
      },

      getGuestCartTotal: () => {
        return get().guestCart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getGuestCartItemsCount: () => {
        return get().guestCart.reduce(
          (count, item) => count + item.quantity,
          0
        );
      },

      // Merge guest cart to user cart after login
      mergeToUserCart: (userCartItems) => {
        const { guestCart } = get();
        const merged = [...userCartItems];

        guestCart.forEach(guestItem => {
          const existingIndex = merged.findIndex(
            item => item.id === guestItem.id && 
            item.selectedSize === guestItem.selectedSize && 
            item.selectedColor === guestItem.selectedColor
          );

          if (existingIndex >= 0) {
            merged[existingIndex].quantity += guestItem.quantity;
          } else {
            merged.push(guestItem);
          }
        });

        return merged;
      },
    }),
    {
      name: 'guest-cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useGuestCartStore;
