import type { User } from "@/coquitos-features/users/interfaces";

export type CashRegisterStatus = "Abierto" | "Cerrado";

/**
 * Caja registradora
 */
export interface CashRegister {
  id: string;
  userId: string;
  openingAmount: number;
  openedAt: Date;
  closingAmount: number | null;
  expectedAmount: number | null;
  difference: number | null;
  closedAt: Date | null;
  totalSales: number;
  totalOrders: number;
  cashSales: number;
  cardSales: number;
  qrSales: number;
  status: CashRegisterStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  user?: User;
}

/**
 * Datos para abrir caja
 */
export interface OpenCashRegisterFormData {
  userId: string;
  openingAmount: number;
}

/**
 * Datos para cerrar caja
 */
export interface CloseCashRegisterFormData {
  cashRegisterId: string;
  closingAmount: number;
  notes?: string;
}

/**
 * Respuesta al abrir caja
 */
export interface OpenCashRegisterResponse {
  message: string;
  cashRegister: CashRegister;
}

/**
 * Respuesta al cerrar caja
 */
export interface CloseCashRegisterResponse {
  message: string;
  cashRegister: CashRegister;
}

/**
 * Respuesta al obtener caja actual
 */
export interface GetCurrentCashRegisterResponse {
  cashRegister: CashRegister | null;
  message?: string;
}

