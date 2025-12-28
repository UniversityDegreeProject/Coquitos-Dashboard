import type { PaymentMethod } from "../interfaces";

interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
}

/**
 * Opciones de métodos de pago
 * Solo Efectivo y QR (según requerimientos)
 */
export const paymentMethodOptions: PaymentMethodOption[] = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "QR", label: "QR" },
];
