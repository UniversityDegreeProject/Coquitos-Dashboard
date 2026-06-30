import type { Sale } from "./sale.interface";

export interface GenerateQRRequest {
  customerId: string;
  userId: string;
  cashRegisterId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    batchId?: string;
  }[];
  notes?: string;
}

export interface GenerateQRResponse {
  error: boolean;
  mensaje: string;
  qr_simple_url: string;
  id_transaccion: string;
  codigo_recaudacion: string;
}

export interface PaymentStatusResponse {
  pagado: boolean;
  valor_total: number;
  saleCompleted: boolean;
  sale: Sale | null;
}

export interface CancelQRResponse {
  released: boolean;
}
