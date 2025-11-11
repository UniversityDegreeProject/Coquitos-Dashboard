import type { Product } from "@/coquitos-features/products/interfaces";
import type { Client } from "@/coquitos-features/clients/interfaces";
import type { User } from "@/coquitos-features/users/interfaces";

/**
 * Tipos para Order
 */
export type OrderStatus = "Pendiente" | "Completado" | "Cancelado" | "Reembolsado";
export type PaymentMethod = "Efectivo" | "Tarjeta" | "QR";

/**
 * Item de una orden (producto en el carrito)
 */
export interface OrderItem {
  id?: string;
  orderId?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  batchId?: string; // Para productos de peso variable
  createdAt?: Date;
  product?: Product;
}

/**
 * Orden de venta
 */
export interface Order {
  id?: string;
  orderNumber?: string;
  customerId: string;
  userId: string;
  cashRegisterId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  status?: OrderStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
  customer?: Client;
  user?: User;
}

/**
 * Parámetros de búsqueda de órdenes
 */
export interface SearchOrdersParams {
  userId?: string;
  customerId?: string;
  cashRegisterId?: string;
  status?: OrderStatus | "";
  paymentMethod?: PaymentMethod | "";
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}

/**
 * Respuesta al obtener órdenes
 */
export interface GetOrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: string | null;
  previousPage: string | null;
}

/**
 * Datos del formulario de creación de orden
 */
export interface OrderFormData {
  customerId: string;
  userId: string;
  cashRegisterId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    batchId?: string;
  }[];
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes?: string;
}

/**
 * Respuesta al crear una orden
 */
export interface CreateOrderResponse {
  message: string;
  order: Order;
}

/**
 * Item del carrito (UI)
 */
export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
  batchId?: string;
  batchCode?: string;
  weight?: number; // Para productos variables
  isVariableWeight: boolean;
}

