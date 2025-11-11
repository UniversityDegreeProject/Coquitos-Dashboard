import type { OrderStatus } from "../interfaces";

interface StatusOption {
  value: OrderStatus | "";
  label: string;
}

/**
 * Opciones de estado para órdenes
 */
export const statusOptions: StatusOption[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Completado", label: "Completado" },
  { value: "Cancelado", label: "Cancelado" },
  { value: "Reembolsado", label: "Reembolsado" },
];

