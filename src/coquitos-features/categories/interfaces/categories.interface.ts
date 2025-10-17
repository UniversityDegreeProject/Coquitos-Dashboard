
export type CategoryStatus = "Activo" | "Inactivo";

export interface CategoryResponse {
  id?: string;
  name: string;
  description?: string;
  status: CategoryStatus;
  productCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  color?: string; // Para el color del indicador
}

export interface Category extends Omit<CategoryResponse, 'productCount'> {
  productCount?: number; // Agregamos el conteo de productos
  isOptimistic?: boolean;
}

export interface CategoriesResponse {
  categories: Category[];
}


