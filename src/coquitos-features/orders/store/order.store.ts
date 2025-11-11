import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import type { CartItem } from "../interfaces";

/**
 * Estado del store de órdenes (ventas)
 */
interface OrderState {
  // Modal de ventas
  isCreateOrderModalOpen: boolean;
  
  // Carrito de compras (items seleccionados)
  cartItems: CartItem[];
  
  // Acciones del modal
  openCreateOrderModal: () => void;
  closeCreateOrderModal: () => void;
  
  // Acciones del carrito
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, batchId?: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number, batchId?: string) => void;
  clearCart: () => void;
  
  // Computed values
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const orderApi: StateCreator<OrderState, [["zustand/devtools", never]], []> = (set, get) => ({
  isCreateOrderModalOpen: false,
  cartItems: [],
  
  openCreateOrderModal: () => 
    set({ isCreateOrderModalOpen: true }, false, "Open create order modal"),
  
  closeCreateOrderModal: () => 
    set({ isCreateOrderModalOpen: false, cartItems: [] }, false, "Close create order modal"),
  
  addToCart: (item: CartItem) => 
    set((state) => {
      // Verificar si el item ya existe (mismo producto y batch si aplica)
      const existingItemIndex = state.cartItems.findIndex(
        (i) => i.productId === item.productId && i.batchId === item.batchId
      );

      if (existingItemIndex !== -1) {
        // Incrementar cantidad si ya existe
        const updatedItems = [...state.cartItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
          total: (updatedItems[existingItemIndex].quantity + item.quantity) * item.unitPrice,
        };
        return { cartItems: updatedItems };
      }

      // Agregar nuevo item
      return { cartItems: [...state.cartItems, item] };
    }, false, "Add to cart"),
  
  removeFromCart: (productId: string, batchId?: string) => 
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => !(item.productId === productId && item.batchId === batchId)
      ),
    }), false, "Remove from cart"),
  
  updateCartItemQuantity: (productId: string, quantity: number, batchId?: string) => 
    set((state) => {
      const updatedItems = state.cartItems.map((item) => {
        if (item.productId === productId && item.batchId === batchId) {
          return {
            ...item,
            quantity,
            total: quantity * item.unitPrice,
          };
        }
        return item;
      });
      return { cartItems: updatedItems };
    }, false, "Update cart item quantity"),
  
  clearCart: () => 
    set({ cartItems: [] }, false, "Clear cart"),
  
  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  },
  
  getCartItemsCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },
});

export const useOrderStore = create<OrderState>()(
  devtools(orderApi, { name: 'order-store' })
);

