import { z } from "zod";

// * Schema para búsqueda de productos
export const searchProductsSchema = z.object({
  search: z.string().optional().default(''),
  categoryId: z.string().optional().default(''),
  status: z.enum(['Disponible', 'SinStock', 'Descontinuado', '' ]).default(''),
  lowStock: z.boolean().optional().default(false),
  nearExpiration: z.boolean().optional().default(false),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(6)
});

export type SearchProductsSchema = z.infer<typeof searchProductsSchema>;
