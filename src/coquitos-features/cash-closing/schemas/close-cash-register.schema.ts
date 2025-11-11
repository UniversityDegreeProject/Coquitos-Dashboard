import { z } from 'zod';

/**
 * Schema para cerrar caja
 */
export const closeCashRegisterSchema = z.object({
  cashRegisterId: z
    .string({ error: 'ID de caja es requerido' })
    .uuid({ error: 'ID de caja inválido' }),
  
  closingAmount: z
    .string({ error: 'Monto final es requerido' })
    .min(1, { error: 'Ingrese el monto final contado' })
    .refine((val) => !isNaN(parseFloat(val)), 'Debe ser un número válido')
    .refine((val) => parseFloat(val) >= 0, 'El monto no puede ser negativo'),
  
  notes: z
    .string()
    .max(500, { error: 'Las notas deben tener máximo 500 caracteres' })
    .optional(),
});

export type CloseCashRegisterSchema = z.infer<typeof closeCashRegisterSchema>;

