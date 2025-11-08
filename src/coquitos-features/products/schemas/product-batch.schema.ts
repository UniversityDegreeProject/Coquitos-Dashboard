import { z } from 'zod';

/**
 * Schema para crear un batch de producto de peso variable
 * Usado en el formulario de agregar batch
 */
export const createBatchSchema = z.object({
  productId: z
    .string({ message: 'ID de producto es requerido' })
    .uuid({ message: 'ID de producto inválido' }),
  
  weight: z
    .string({ message: 'Peso es requerido' })
    .min(1, 'El peso es requerido')
    .refine((val) => !isNaN(parseFloat(val)), { message: 'El peso debe ser un número válido' })
    .refine((val) => parseFloat(val) > 0, { message: 'El peso debe ser mayor a 0' })
    .refine((val) => parseFloat(val) <= 10, { message: 'Peso máximo 10 kg' })
    .refine((val) => /^\d+(\.\d{1,3})?$/.test(val), {
      message: 'El peso solo puede tener máximo 3 decimales'
    }),
  
  unitPrice: z
    .string({ message: 'Precio es requerido' })
    .min(1, 'El precio es requerido')
    .refine((val) => !isNaN(parseFloat(val)), { message: 'El precio debe ser un número válido' })
    .refine((val) => parseFloat(val) > 0, { message: 'El precio debe ser mayor a 0' })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: 'El precio solo puede tener máximo 2 decimales'
    }),
});

/**
 * Schema para actualizar stock de un batch
 */
export const updateBatchStockSchema = z.object({
  batchId: z
    .string({ message: 'ID de batch es requerido' })
    .uuid({ message: 'ID de batch inválido' }),
  
  stock: z
    .number({ message: 'Stock es requerido' })
    .int({ message: 'Stock debe ser un número entero' })
    .min(0, { message: 'Stock no puede ser negativo' }),
});

/**
 * Tipos inferidos de los schemas
 */
export type CreateBatchSchema = z.infer<typeof createBatchSchema>;
export type UpdateBatchStockSchema = z.infer<typeof updateBatchStockSchema>;

