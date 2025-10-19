// Interfaces basadas en la documentación del backend

export type ProductStatus = "Disponible" | "SinStock" | "Descontinuado";

// * Interfaz para la categoría relacionada
export interface CategoryRelation {
  id: string;
  name: string;
  description?: string;
  status: string;
}

// * Interfaz del producto según el backend
export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  minStock: number;
  image: string;
  ingredients: string;
  status: ProductStatus;
  categoryId: string;
  category: CategoryRelation;
  createdAt: string;
  updatedAt: string;
}

// * Interfaz para crear/actualizar producto
export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock?: number;
  minStock?: number;
  image?: string;
  ingredients?: string;
  categoryId: string;
  status?: ProductStatus;
}

// * Interfaz para búsqueda de productos
export interface SearchProductsParams {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

// * Respuesta de la API con productos
export interface GetProductsResponse {
  products: ProductResponse[];
}

// * Respuesta de búsqueda con paginación
export interface SearchProductsResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// * Respuesta al crear/actualizar producto
export interface ProductMutationResponse {
  message: string;
  product: ProductResponse;
}
