export interface GenerateQRRequest {
  amount: number;
  items: {
    concepto: string;
    cantidad: number;
    costo_unitario: number;
  }[];
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
  fecha_pago: string | null;
}
