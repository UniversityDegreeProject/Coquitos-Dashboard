/**
 * ========================================
 * TIPOS Y ENUMS
 * ========================================
 */

/**
 * Tipo de estado de una categoría
 */
export type CategoryStatus = "Activo" | "Inactivo";

/**
 * ========================================
 * INTERFACES DE RESPUESTA DEL BACKEND
 * ========================================
 */

/**
 * Respuesta del backend para una categoría individual
 */
export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Respuesta del backend con lista de categorías
 */
export interface GetCategoriesResponse {
  categories: CategoryResponse[];
}

/**
 * Respuesta del backend para búsqueda de categorías
 */
export interface SearchCategoriesResponse {
  categories: CategoryResponse[];
}

/**
 * Respuesta del backend para mutaciones (create, update, delete)
 */
export interface CategoryMutationResponse {
  category: CategoryResponse;
}

/**
 * ========================================
 * INTERFACES PARA FORMULARIOS Y DATOS
 * ========================================
 */

/**
 * Datos del formulario para crear/actualizar categoría
 */
export interface CategoryFormData {
  name: string;
  description: string;
  status: CategoryStatus;
}

/**
 * Parámetros para búsqueda de categorías
 */
export interface SearchCategoriesParams {
  search?: string;
  status?: CategoryStatus | "";
}

/**
 * ========================================
 * INTERFACES EXTENDIDAS PARA UI
 * ========================================
 */

/**
 * Interfaz extendida de categoría con campos opcionales de UI
 */
export interface Category extends CategoryResponse {
  isOptimistic?: boolean;
  productCount?: number;
  color?: string;
}

