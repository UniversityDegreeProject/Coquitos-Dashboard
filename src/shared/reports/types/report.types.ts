/**
 * Tipos e interfaces para reportes
 * Única fuente de verdad para todos los tipos de reportes
 */

// Tipos base
export type PaymentMethod = "Efectivo" | "Tarjeta" | "QR";

export type CashRegisterStatus = "Abierto" | "Cerrado";

// Reporte Diario
export interface DailyReport {
  date: string;
  cashRegister: CashRegisterInfo | null;
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  salesByPaymentMethod: {
    cash: number;
    card: number;
    qr: number;
  };
}

export interface CashRegisterInfo {
  id: string;
  userId: string;
  openingAmount: number;
  openedAt: string;
  closingAmount: number | null;
  expectedAmount: number | null;
  difference: number | null;
  closedAt: string | null;
  totalSales: number;
  totalOrders: number;
  cashSales: number;
  cardSales: number;
  qrSales: number;
  status: CashRegisterStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Reporte de Ventas
export interface SalesReport {
  startDate: string;
  endDate: string;
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  salesByPaymentMethod: {
    cash: number;
    card: number;
    qr: number;
  };
  salesByDay: Array<{
    date: string;
    total: number;
    orders: number;
  }>;
  salesByHour: Array<{
    hour: number;
    total: number;
    orders: number;
  }>;
}

// Reporte de Productos
export interface ProductReportItem {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
  percentage: number;
}

export interface ProductsReport {
  startDate: string;
  endDate: string;
  products: ProductReportItem[];
}

// Reporte de Clientes
export interface CustomerReportItem {
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
  percentage: number;
}

export interface CustomersReport {
  startDate: string;
  endDate: string;
  customers: CustomerReportItem[];
}

// Resumen de Cierres de Caja
export interface CashRegisterSummaryDay {
  date: string;
  totalSales: number;
  totalOrders: number;
  status: CashRegisterStatus;
  openingAmount: number | null;
  closingAmount: number | null;
  difference: number | null;
}

export interface CashRegisterSummaryReport {
  startDate: string;
  endDate: string;
  days: CashRegisterSummaryDay[];
}

// Respuestas de la API
export interface DailyReportResponse {
  report: DailyReport;
}

export interface SalesReportResponse {
  report: SalesReport;
}

export interface ProductsReportResponse {
  report: ProductsReport;
}

export interface CustomersReportResponse {
  report: CustomersReport;
}

export interface CashRegisterSummaryResponse {
  report: CashRegisterSummaryReport;
}

// Parámetros para obtener reportes
export interface GetDailyReportParams {
  date: string; // YYYY-MM-DD
}

export interface GetSalesReportParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface GetProductsReportParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  limit?: number; // Default: 10
}

export interface GetCustomersReportParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  limit?: number; // Default: 10
}

export interface GetCashRegisterSummaryParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

