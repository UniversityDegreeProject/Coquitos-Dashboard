import type { Product } from "./product.interface";

/**
 * Interface para un batch de producto de peso variable
 */
export interface ProductBatch {
  id: string;
  productId: string;
  batchCode: string;
  weight: number; // En kg
  unitPrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

/**
 * Response al obtener batches por producto
 */
export interface GetBatchesResponse {
  batches: ProductBatch[];
}

/**
 * Response al crear un batch
 */
export interface CreateBatchResponse {
  message: string;
  batch: ProductBatch;
}

/**
 * Response al actualizar stock de batch
 */
export interface UpdateBatchStockResponse {
  message: string;
  batch: ProductBatch;
}

/**
 * Response al eliminar batch
 */
export interface DeleteBatchResponse {
  message: string;
  batch: ProductBatch;
}

/**
 * Form data para crear un batch
 */
export interface CreateBatchFormData {
  productId: string;
  weight: number;
  unitPrice: number;
}

/**
 * Form data para actualizar stock de batch
 */
export interface UpdateBatchStockFormData {
  batchId: string;
  stock: number;
  userId: string;
  reason?: string;
  notes?: string;
}

