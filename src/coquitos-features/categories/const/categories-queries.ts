import type { SearchCategoriesParams } from "../interfaces";

export const categoriesQueries = {
  allCategories: ['categories'] as const,
  categoryById: (id: string) => [categoriesQueries.allCategories, id] as const,
  categoryWithFilters: (params: SearchCategoriesParams) => [categoriesQueries.allCategories, 'filters', params] as const,


}                                                      