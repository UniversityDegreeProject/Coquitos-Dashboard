import type { SaleStatus } from "../interfaces";

interface StatusOption {
  value: SaleStatus | "";
  label: string;
}

/**
 * Opciones de estado para ventas
 */
export const statusOptions: StatusOption[] = [
  { value: "Completado", label: "Completado" },
];
