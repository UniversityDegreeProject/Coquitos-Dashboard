// * Library
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
// * Interfaces
import type { Product } from "../interfaces";

interface ProductState {
  modalMode: 'create' | 'update' | 'delete' | null;
  productToUpdate: Product | null;
  viewMode: 'grid' | 'list';
  setOpenModalCreate: () => void;
  setOpenModalUpdate: (product: Product) => void;
  closeModal: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

const productApi: StateCreator<ProductState, [["zustand/devtools", never]], []> = (set) => ({
  modalMode: null,
  productToUpdate: null,
  viewMode: 'grid',
  setOpenModalCreate: () => 
    set((state) => ({ ...state, modalMode: 'create' }), false, "Open create product modal"),
  setOpenModalUpdate: (product: Product) => 
    set((state) => ({ ...state, modalMode: 'update', productToUpdate: product }), false, "Open update product modal"),
  closeModal: () => 
    set((state) => ({ ...state, modalMode: null, productToUpdate: null }), false, "Close modal"),
  setViewMode: (mode: 'grid' | 'list') => 
    set((state) => ({ ...state, viewMode: mode }), false, `Set view mode to ${mode}`),
});

export const useProductStore = create<ProductState>()(
  devtools(
    productApi, { name: 'product-store' }
  )
);

