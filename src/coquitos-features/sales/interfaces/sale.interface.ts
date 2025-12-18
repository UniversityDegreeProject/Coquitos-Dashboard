import type { Product } from "@/coquitos-features/products/interfaces";
import type { Client } from "@/coquitos-features/clients/interfaces";
import type { User } from "@/coquitos-features/users/interfaces";

/**
 * Tipos para Sale
 */
export type SaleStatus =
  | "Pendiente"
  | "Completado"
  | "Cancelado"
  | "Reembolsado";
export type PaymentMethod = "Efectivo" | "Tarjeta" | "QR";
export type DateRange = "today" | "week" | "month";

/**
 * Item de una venta (producto en el carrito)
 */
export interface SaleItem {
  id?: string;
  saleId?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  batchId?: string; // Para productos de peso variable
  createdAt?: Date;
  product?: Product;
}

/**
 * Venta
 */
export interface Sale {
  id?: string;
  saleNumber?: string;
  customerId: string;
  userId: string;
  cashRegisterId: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  status?: SaleStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
  customer?: Client;
  user?: User;
}

/**
 * Parámetros de búsqueda de ventas
 */
export interface SearchSalesParams {
  userId?: string;
  customerId?: string;
  cashRegisterId?: string;
  status?: SaleStatus | "";
  paymentMethod?: PaymentMethod | "";
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}

/**
 * Respuesta al obtener ventas
 */
export interface GetSalesResponse {
  data: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: string | null;
  previousPage: string | null;
}

/**
 * Datos del formulario de creación de venta
 */
export interface SaleFormData {
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
 * Respuesta al crear una venta
 */
export interface CreateSaleResponse {
  message: string;
  sale: Sale;
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
  availableStock: number; // Stock disponible para validación
}
