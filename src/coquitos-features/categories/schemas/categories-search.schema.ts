import { z as zod } from 'zod';

export const categoriesSearchSchema = zod.object({
  search: zod.string().optional().default(''),
  status: zod.enum(['Activo', 'Inactivo', '']).optional().default(''),
});

export type SearchCategoriesSchema = zod.infer<typeof categoriesSearchSchema>;