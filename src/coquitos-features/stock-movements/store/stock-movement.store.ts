import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product } from "@/coquitos-features/products/interfaces";

/**
 * Interface del estado del store de movimientos de stock
 */
interface StockMovementState {
  /** Modal de formulario abierto/cerrado */
  isModalOpen: boolean;
  /** Producto seleccionado para el movimiento de stock */
  selectedProduct: Product | null;
  
  /** Abre el modal con el producto seleccionado */
  openStockMovementModal: (product: Product) => void;
  /** Cierra el modal */
  closeModal: () => void;
}


const useStockMovementApi: StateCreator<StockMovementState, [["zustand/devtools", never]], []> = (set) => ({
  isModalOpen: false,
  selectedProduct: null,
  openStockMovementModal: (product: Product) => {
    set({ isModalOpen: true, selectedProduct: product }, false, "Open stock movement modal");
  },
  closeModal: () => {
    set({ isModalOpen: false, selectedProduct: null }, false, "Close stock movement modal");
  },
});


export const useStockMovementStore = create<StockMovementState>()(
  devtools(
    useStockMovementApi, 
    { name: "stock-movement-store" }
  )
);

