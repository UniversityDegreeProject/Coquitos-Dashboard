export type ProductStatus = "Activo" | "Inactivo" | "Agotado";

export interface ProductResponse {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  categoryId?: string;
  status: ProductStatus;
  imageUrl?: string;
  stock?: number;
  sku?: string;
  barcode?: string;
  costPrice?: number;
  profitMargin?: number;
  isFeatured?: boolean;
  tags?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  allergens?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product extends ProductResponse {
  isOptimistic?: boolean;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: ProductStatus | "";
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
