import { z } from "zod";

/**
 * Schema para crear una venta
 * Validación en el frontend antes de enviar al backend
 */
export const createSaleSchema = z.object({
  customerId: z
    .uuid({ error: "ID de cliente inválido" })
    .min(1, { error: "Debe seleccionar un cliente" }),

  paymentMethod: z.enum(["Efectivo", "QR"], {
    error: "Método de pago debe ser Efectivo o QR",
  }),

  amountPaid: z
    .string({ error: "Monto pagado es requerido" })
    .min(1, { error: "Ingrese el monto pagado" }),

  notes: z
    .string()
    .max(500, { error: "Las notas deben tener máximo 500 caracteres" })
    .optional(),
});

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;
