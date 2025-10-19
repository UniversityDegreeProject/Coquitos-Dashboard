import { z } from 'zod';

// * Schema para crear producto (según documentación backend)
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  
  price: z
    .string()
    .min(1, 'El precio es requerido')
    .refine((val) => !isNaN(parseFloat(val)), 'El precio debe ser un número válido')
    .refine((val) => parseFloat(val) > 0, 'El precio debe ser mayor a 0')
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: 'El precio solo puede tener máximo 2 decimales'
    }),
  
  sku: z
    .string()
    .max(50, 'El código no puede exceder 50 caracteres')
    .optional(),
  
  stock: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseInt(val)), 'El stock debe ser un número válido')
    .refine((val) => !val || parseInt(val) >= 0, 'El stock no puede ser negativo')
    .refine((val) => !val || Number.isInteger(parseFloat(val)), 'El stock debe ser un número entero'),
  
  minStock: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseInt(val)), 'El stock mínimo debe ser un número válido')
    .refine((val) => !val || parseInt(val) >= 0, 'El stock mínimo no puede ser negativo')
    .refine((val) => !val || Number.isInteger(parseFloat(val)), 'El stock mínimo debe ser un número entero'),
  
  image: z
    .string()
    .url('Debe ser una URL válida')
    .optional(),
  
  ingredients: z
    .string()
    .max(1000, 'Los ingredientes no pueden exceder 1000 caracteres')
    .optional(),
  
  categoryId: z
    .string()
    .uuid('El ID de categoría debe ser un UUID válido')
    .min(1, 'La categoría es requerida'),
  
  status: z
    .enum(['Disponible', 'SinStock', 'Descontinuado'])
    .default('Disponible')
});

// * Schema para actualizar producto (todos los campos opcionales)
export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  
  price: z
    .number({
      invalid_type_error: 'El precio debe ser un número válido'
    })
    .positive('El precio debe ser mayor a 0')
    .refine((val) => val === undefined || /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: 'El precio solo puede tener máximo 2 decimales'
    })
    .optional(),
  
  sku: z
    .string()
    .max(50, 'El SKU no puede exceder 50 caracteres')
    .optional(),
  
  minStock: z
    .number({
      invalid_type_error: 'El stock mínimo debe ser un número válido'
    })
    .int('El stock mínimo debe ser un número entero')
    .min(0, 'El stock mínimo no puede ser negativo')
    .optional(),
  
  image: z
    .string()
    .url('Debe ser una URL válida')
    .optional(),
  
  ingredients: z
    .string()
    .max(1000, 'Los ingredientes no pueden exceder 1000 caracteres')
    .optional(),
  
  categoryId: z
    .string()
    .uuid('El ID de categoría debe ser un UUID válido')
    .optional(),
  
  status: z
    .enum(['Disponible', 'SinStock', 'Descontinuado'])
    .optional()
});

// * Schema para búsqueda de productos
export const searchProductsSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(['Disponible', 'SinStock', 'Descontinuado']).optional(),
  lowStock: z.boolean().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10)
});

// * Tipos inferidos
export type CreateProductSchema = z.input<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type SearchProductsSchema = z.infer<typeof searchProductsSchema>;

