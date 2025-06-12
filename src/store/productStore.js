// store/productStore.js
import { create } from 'zustand'
import axios from 'axios'

const useProductStore = create((set) => ({
  products: [],
  fetchProducts: async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
    set({ products: res.data })
  },
  setProducts: (newList) => set({ products: newList }),
  addProduct: (newProduct) => set((state) => ({ products: [newProduct, ...state.products] }))
}))

export default useProductStore
