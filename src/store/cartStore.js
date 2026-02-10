import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartArray: [],

      addToCart: (product, selectedSize, selectedColor) => {
        const { cartArray } = get();
        
        // Check if product already exists in cart
        const existingItem = cartArray.find(
          item => item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
        );

        if (existingItem) {
          // Check stock availability
          const variation = product.variation?.find(
            v => v.size === selectedSize && v.color === selectedColor
          );
          
          if (variation && variation.stock <= existingItem.quantity) {
            toast.error('Not enough stock available');
            return;
          }

          set({
            cartArray: cartArray.map(item =>
              item.id === product.id && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
          toast.success('Quantity updated in cart');
        } else {
          const newItem = {
            ...product,
            quantity: 1,
            selectedSize: selectedSize || product.variation?.[0]?.size || 'M',
            selectedColor: selectedColor || product.variation?.[0]?.color || 'Black',
          };
          set({ cartArray: [...cartArray, newItem] });
          toast.success('Added to cart');
        }
      },

      removeFromCart: (itemId) => {
        set({
          cartArray: get().cartArray.filter(item => item.id !== itemId)
        });
        toast.success('Removed from cart');
      },

      updateCart: (itemId, quantity, selectedSize, selectedColor, product) => {
        const { cartArray } = get();
        
        // Check stock if product data is provided
        if (product) {
          const variation = product.variation?.find(
            v => v.size === selectedSize && v.color === selectedColor
          );
          
          if (variation && variation.stock < quantity) {
            toast.error(`Only ${variation.stock} items available in stock`);
            return;
          }
        }

        set({
          cartArray: cartArray.map(item =>
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

      clearCart: () => {
        set({ cartArray: [] });
      },

      getCartTotal: () => {
        return get().cartArray.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getCartItemsCount: () => {
        return get().cartArray.reduce(
          (count, item) => count + item.quantity,
          0
        );
      },

      isInCart: (productId) => {
        return get().cartArray.some(item => item.id === productId);
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
