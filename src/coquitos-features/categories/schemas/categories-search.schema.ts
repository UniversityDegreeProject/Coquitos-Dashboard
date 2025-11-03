import { z as zod } from 'zod';

export const categoriesSearchSchema = zod.object({
  search: zod.string().optional().default(''),
  categoryId:zod.uuid().optional(),
  status: zod.enum(['Activo', 'Inactivo', '']).optional().default(''),
  minStock: zod.number().optional(),
});

export type SearchCategoriesSchema = zod.infer<typeof categoriesSearchSchema>;