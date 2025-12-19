import type { SaleStatus } from "../interfaces";

interface StatusOption {
  value: SaleStatus | "";
  label: string;
}

/**
 * Opciones de estado para ventas
 */
export const statusOptions: StatusOption[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Completado", label: "Completado" },
  { value: "Cancelado", label: "Cancelado" },
  { value: "Reembolsado", label: "Reembolsado" },
];
