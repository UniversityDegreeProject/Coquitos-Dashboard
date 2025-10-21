import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ProductResponse } from "@/coquitos-features/products/interfaces";

/**
 * Interface del estado del store de movimientos de stock
 */
interface StockMovementState {
  /** Modal de formulario abierto/cerrado */
  isModalOpen: boolean;
  /** Producto seleccionado para el movimiento de stock */
  selectedProduct: ProductResponse | null;
  
  /** Abre el modal con el producto seleccionado */
  openModal: (product: ProductResponse) => void;
  /** Cierra el modal */
  closeModal: () => void;
}

/**
 * Store de Zustand para gestionar el estado UI de movimientos de stock
 * Maneja la apertura/cierre del modal y el producto seleccionado
 */
export const useStockMovementStore = create<StockMovementState>()(
  devtools(
    (set) => ({
      isModalOpen: false,
      selectedProduct: null,

      openModal: (product: ProductResponse) => {
        set({ isModalOpen: true, selectedProduct: product }, false, "Open stock movement modal");
      },

      closeModal: () => {
        set({ isModalOpen: false, selectedProduct: null }, false, "Close stock movement modal");
      },
    }),
    { name: "stock-movement-store" }
  )
);

