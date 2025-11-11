import { z } from "zod";

/**
 * Schema para búsqueda de órdenes (ventas)
 */
export const searchOrdersSchema = z.object({
  search: z.string().optional().default(''),
  paymentMethod: z.enum(['Efectivo', 'Tarjeta', 'QR', '']).optional().default(''),
  status: z.enum(['Pendiente', 'Completado', 'Cancelado', 'Reembolsado', '']).optional().default(''),
});

export type SearchOrdersSchema = z.infer<typeof searchOrdersSchema>;

