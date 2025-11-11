import { z } from 'zod';

/**
 * Schema para crear una orden (venta)
 * Validación en el frontend antes de enviar al backend
 */
export const createOrderSchema = z.object({
  customerId: z
    .string({ error: 'Cliente es requerido' })
    .uuid({ error: 'ID de cliente inválido' })
    .min(1, { error: 'Debe seleccionar un cliente' }),
  
  paymentMethod: z
    .enum(['Efectivo', 'Tarjeta', 'QR'], {
      error: 'Método de pago debe ser Efectivo, Tarjeta o QR',
    }),
  
  amountPaid: z
    .string({ error: 'Monto pagado es requerido' })
    .min(1, { error: 'Ingrese el monto pagado' }),
  
  notes: z
    .string()
    .max(500, { error: 'Las notas deben tener máximo 500 caracteres' })
    .optional(),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;

