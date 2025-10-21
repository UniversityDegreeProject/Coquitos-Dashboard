import type { StockMovementType } from "../interfaces";

/**
 * Opciones de tipos de movimiento de stock para selects
 */
export const movementTypeOptions: { value: StockMovementType | ""; label: string }[] = [
  { value: "", label: "Selecciona un tipo" },
  { value: "Reabastecimiento", label: "Reabastecimiento" },
  { value: "Compra", label: "Compra" },
  { value: "Venta", label: "Venta" },
  { value: "Ajuste", label: "Ajuste de Inventario" },
  { value: "Devolucion", label: "Devolución" },
  { value: "Dañado", label: "Producto Dañado" },
];

