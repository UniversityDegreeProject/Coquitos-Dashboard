import type { Product } from "./product.interface";


export interface GetBatchesResponse {
  batches: ProductBatch[];
}


/**
 * Interface para un batch de producto de peso variable
 */
export interface ProductBatch {
  id: string;
  productId: string;
  batchCode: string;
  weight: number; 
  unitPrice: number;
  stock: number;
  expirationDate?: Date | string;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

/**
 * Form data para crear un batch
 */
export interface CreateBatchFormData {
  id?: string;
  productId: string;
  weight: number;
  unitPrice: number;
  expirationDate?: Date | string;
}

/**
 * Batch temporal (pendiente) durante la creación del producto
 * No tiene id ni batchCode porque aún no existe en el backend
 */
export interface PendingBatch {
  tempId: string; // ID temporal único para React keys
  weight: number;
  unitPrice: number;
  expirationDate?: string; // Formato YYYY-MM-DD para input date
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



