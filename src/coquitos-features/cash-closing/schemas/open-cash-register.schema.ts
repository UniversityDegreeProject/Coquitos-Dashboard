import { z } from 'zod';

/**
 * Schema para abrir caja
 */
export const openCashRegisterSchema = z.object({
  userId: z
    .string({ error: 'Usuario es requerido' })
    .uuid({ error: 'ID de usuario inválido' }),
  
  openingAmount: z
    .string({ error: 'Monto inicial es requerido' })
    .min(1, { error: 'Ingrese el monto inicial' })
    .refine((val) => !isNaN(parseFloat(val)), 'Debe ser un número válido')
    .refine((val) => parseFloat(val) >= 0, 'El monto no puede ser negativo'),
});

export type OpenCashRegisterSchema = z.infer<typeof openCashRegisterSchema>;

