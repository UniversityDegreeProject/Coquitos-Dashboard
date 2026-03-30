import { z } from "zod";

/**
 * Schema para crear una venta
 * Validación en el frontend antes de enviar al backend
 */
export const createSaleSchema = z
  .object({
    customerId: z
      .uuid({ error: "ID de cliente inválido" })
      .min(1, { error: "Debe seleccionar un cliente" }),

    paymentMethod: z.enum(["Efectivo", "QR"], {
      error: "Método de pago debe ser Efectivo o QR",
    }),

    amountPaid: z
      .string({ error: "Monto pagado es requerido" })
      .optional()
      .default(""),

    notes: z
      .string()
      .max(500, { error: "Las notas deben tener máximo 500 caracteres" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Solo validar amountPaid si el método NO es QR
    // En QR el monto lo valida Libélula automáticamente
    if (data.paymentMethod !== "QR") {
      if (!data.amountPaid || data.amountPaid.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["amountPaid"],
          message: "Ingrese el monto pagado",
        });
      }
    }
  });

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;
