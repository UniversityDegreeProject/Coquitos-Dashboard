// Interfaces basadas en la documentación del backend

import type { Category } from "@/coquitos-features/categories/interfaces";
import type { ProductBatch } from "./product-batch.interface";

export type ProductStatus = "Disponible" | "SinStock" | "Descontinuado";

// * Interfaz para la categoría relacionada
export interface GetProductsResponse{
    data:         Product[];
    total:        number;
    page:         number;
    limit:        number;
    totalPages:   number;
    nextPage:     string | null;
    previousPage: string | null;
}

export interface Product {
    id?:         string;
    name:        string;
    description?: string;
    price:       number;
    sku:         string;
    stock:       number;
    minStock:    number;
    image:       string;
    status:      ProductStatus;
    ingredients?: string;
    categoryId:  string;
    isVariableWeight?: boolean;
    pricePerKg?:      number;
    category?:    Category;
    batches?:     ProductBatch[];
    createdAt?:  Date;
    updatedAt?:  Date;
}

export interface ProductFormData {
    id?:         string;
    name:        string;
    description?: string;
    price:      number;
    sku:        string;
    stock:      number;
    minStock:   number;
    image:      string;
    status:     ProductStatus;
    ingredients?: string;
    categoryId: string;
    isVariableWeight?: boolean;
    pricePerKg?:      number;
    category?:   Category;
    createdAt?:  Date;
    updatedAt?:  Date;
}

export interface SearchProductsParams {
    search?:    string;
    categoryId?: string;
    status?:    ProductStatus | "";
    lowStock?:  boolean;
    page :    number;
    limit :   number;
}

export interface CreateProductResponse {
    message: string;
    product: Product;
}

export interface UpdateProductResponse {
    message: string;
    product: Product;
}

export interface DeleteProductResponse {
    message: string;
    product: Product;
}
