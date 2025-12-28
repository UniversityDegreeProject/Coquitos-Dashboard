import type { PaymentMethod } from "../interfaces";

/**
 * Retorna las clases de Tailwind para el badge de método de pago
 */
export const getPaymentMethodColor = (paymentMethod: PaymentMethod): string => {
  const colors: Record<PaymentMethod, string> = {
    Efectivo:
      "bg-green-300 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    QR: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return colors[paymentMethod] || colors.Efectivo;
};
