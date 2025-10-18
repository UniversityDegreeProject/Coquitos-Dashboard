/**
 * Tipo de estado de una categoría
 */
export type CategoryStatus = "Activo" | "Inactivo";

/**
 * Respuesta del backend para una categoría
 */
export interface CategoryResponse {
  id?: string;
  name: string;
  description: string;
  status: CategoryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interfaz extendida de categoría con campos opcionales de UI
 */
export interface Category extends CategoryResponse {
  isOptimistic?: boolean;
  productCount?: number;
  color?: string;
}

/**
 * Respuesta del backend con lista de categorías
 */
export interface CategoriesResponse {
  categories: Category[];
}


