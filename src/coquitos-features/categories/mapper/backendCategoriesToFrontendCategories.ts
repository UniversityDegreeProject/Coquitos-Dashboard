import type { Category } from "../interfaces";


export const backendCategoriesToFrontendCategories = (categories: Category): Category => {
  const { id, name, description, status, createdAt, updatedAt } = categories;
  return {
    id,
    name,
    description,
    status,
    createdAt,
    updatedAt,
  }
}