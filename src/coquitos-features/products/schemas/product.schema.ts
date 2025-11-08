import { z } from 'zod';

// * Schema para crear producto (según documentación backend)
export const productSchema = z.object({
  id: z.uuid()
    .optional(),
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
    .min(1, 'El código del producto es requerido')
    .max(50, 'El código no puede exceder 50 caracteres'),
  
  stock: z
    .string()
    .min(1, 'El stock actual es requerido')
    .refine((val) => !isNaN(parseInt(val)), 'El stock debe ser un número válido')
    .refine((val) => parseInt(val) >= 0, 'El stock no puede ser negativo')
    .refine((val) => Number.isInteger(parseFloat(val)), 'El stock debe ser un número entero'),
  
  minStock: z
    .string()
    .min(1, 'El stock mínimo es requerido')
    .refine((val) => !isNaN(parseInt(val)), 'El stock mínimo debe ser un número válido')
    .refine((val) => parseInt(val) >= 0, 'El stock mínimo no puede ser negativo')
    .refine((val) => Number.isInteger(parseFloat(val)), 'El stock mínimo debe ser un número entero'),
  
  image: z
    .string()
    .min(1, 'La imagen es requerida')
    .refine((val) => {
      // Acepta URLs o imágenes en Base64
      return z.string().url().safeParse(val).success || val.startsWith('data:image/');
    }, {
      message: 'Debe ser una URL válida o una imagen'
    }),
  
  ingredients: z
    .string()
    .max(1000, 'Los ingredientes no pueden exceder 1000 caracteres')
    .optional(),
  
  categoryId: z
    .uuid('El ID de categoría debe ser un UUID válido')
    .min(1, 'La categoría es requerida'),
  
  status: z
    .enum(['Disponible', 'SinStock', 'Descontinuado'])
    .default('Disponible'),
    
});



// * Tipos inferidos
export type ProductSchema = z.input<typeof productSchema>;

