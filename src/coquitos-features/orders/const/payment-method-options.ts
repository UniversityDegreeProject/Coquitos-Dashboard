import type { PaymentMethod } from "../interfaces";

interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
}

/**
 * Opciones de métodos de pago
 * Solo Efectivo, Tarjeta y QR (según requerimientos)
 */
export const paymentMethodOptions: PaymentMethodOption[] = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta", label: "Tarjeta" },
  { value: "QR", label: "QR" },
];

