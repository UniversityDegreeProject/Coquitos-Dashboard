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
    .optional()
    .default(''),
  
  sku: z
    .string()
    .min(1, 'El código del producto es requerido')
    .max(50, 'El código no puede exceder 50 caracteres'),
  
  stock: z
    .string()
    .optional()
    .default('0'),
  
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
  
  isVariableWeight: z
    .boolean({ error: 'Tipo de producto inválido' })
    .default(false),
  
  pricePerKg: z
    .string()
    .optional()
    .default(''),
}).superRefine((data, ctx) => {
  // SI ES PESO VARIABLE: solo validar pricePerKg
  if (data.isVariableWeight) {
    if (!data.pricePerKg || data.pricePerKg.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['pricePerKg'],
        message: 'El precio por kg es requerido',
      });
      return;
    }
    
    const pricePerKgNum = parseFloat(data.pricePerKg);
    if (isNaN(pricePerKgNum)) {
      ctx.addIssue({
        code: 'custom',
        path: ['pricePerKg'],
        message: 'El precio por kg debe ser un número válido',
      });
      return;
    }
    
    if (pricePerKgNum <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['pricePerKg'],
        message: 'El precio por kg debe ser mayor a 0',
      });
      return;
    }
    
    if (!/^\d+(\.\d{1,2})?$/.test(data.pricePerKg)) {
      ctx.addIssue({
        code: 'custom',
        path: ['pricePerKg'],
        message: 'El precio por kg solo puede tener máximo 2 decimales',
      });
    }
  }
  
  // SI NO ES PESO VARIABLE: validar price y stock
  if (!data.isVariableWeight) {
    // Validar price
    if (!data.price || data.price.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['price'],
        message: 'El precio es requerido',
      });
    } else {
      const priceNum = parseFloat(data.price);
      if (isNaN(priceNum)) {
        ctx.addIssue({
          code: 'custom',
          path: ['price'],
          message: 'El precio debe ser un número válido',
        });
      } else if (priceNum <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['price'],
          message: 'El precio debe ser mayor a 0',
        });
      } else if (!/^\d+(\.\d{1,2})?$/.test(data.price)) {
        ctx.addIssue({
          code: 'custom',
          path: ['price'],
          message: 'El precio solo puede tener máximo 2 decimales',
        });
      }
    }
    
    // Validar stock
    if (!data.stock || data.stock.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['stock'],
        message: 'El stock es requerido',
      });
    } else {
      const stockNum = parseInt(data.stock);
      if (isNaN(stockNum)) {
        ctx.addIssue({
          code: 'custom',
          path: ['stock'],
          message: 'El stock debe ser un número válido',
        });
      } else if (stockNum < 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['stock'],
          message: 'El stock no puede ser negativo',
        });
      } else if (!Number.isInteger(stockNum)) {
        ctx.addIssue({
          code: 'custom',
          path: ['stock'],
          message: 'El stock debe ser un número entero',
        });
      }
    }
  }
});



// * Tipos inferidos
export type ProductSchema = z.input<typeof productSchema>;

