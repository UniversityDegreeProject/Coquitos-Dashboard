import { z as zod } from "zod";

/**
 * Schema de validación para crear un movimiento de stock
 */
export const createStockMovementSchema = zod.object({
  productId: zod.string({ message: "Producto es requerido" }).uuid({ message: "ID de producto inválido" }),
  type: zod.enum(["Reabastecimiento", "Compra", "Venta", "Ajuste", "Devolucion", "Dañado"], {
    message: "Tipo de movimiento es requerido"
  }),
  quantity: zod
    .number({ message: "Cantidad es requerida" })
    .int({ message: "La cantidad debe ser un número entero" })
    .positive({ message: "La cantidad debe ser positiva" })
    .min(1, { message: "La cantidad mínima es 1" })
    .max(10000, { message: "La cantidad máxima es 10,000" }),
  reason: zod
    .string({ message: "Motivo es requerido" })
    .min(5, { message: "El motivo debe tener al menos 5 caracteres" })
    .max(200, { message: "El motivo debe tener máximo 200 caracteres" }),
  reference: zod
    .string({ message: "Referencia es requerida" })
    .min(3, { message: "La referencia debe tener al menos 3 caracteres" })
    .max(50, { message: "La referencia debe tener máximo 50 caracteres" }),
  notes: zod
    .string()
    .max(500, { message: "Las notas deben tener máximo 500 caracteres" })
    .optional()
    .or(zod.literal('')),
});

export type StockMovementSchema = zod.infer<typeof createStockMovementSchema>;

