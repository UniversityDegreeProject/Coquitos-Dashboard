import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
  ProductBatch,
  GetBatchesResponse,
  CreateBatchResponse,
  CreateBatchFormData,
  UpdateBatchStockResponse,
  UpdateBatchStockFormData,
  DeleteBatchResponse,
} from "../interfaces";

/**
 * Obtiene todos los batches de un producto
 * GET /api/products/:productId/batches
 */
export const getBatchesByProduct = async (productId: string): Promise<ProductBatch[]> => {
  try {
    const response = await CoquitoApi.get<GetBatchesResponse>(`/products/${productId}/batches`);
    return response.data.batches;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener batches');
    }
    throw new Error('Error desconocido al obtener batches');
  }
};

/**
 * Crea un nuevo batch para un producto
 * POST /api/products/:productId/batches
 */
export const createBatch = async (productId: string, batchData: CreateBatchFormData): Promise<CreateBatchResponse> => {
  try {
    const response = await CoquitoApi.post<CreateBatchResponse>(
      `/products/${productId}/batches`,
      batchData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al crear batch');
    }
    throw new Error('Error desconocido al crear batch');
  }
};

/**
 * Actualiza el stock de un batch
 * PATCH /api/products/batches/:batchId
 */
export const updateBatchStock = async (data: UpdateBatchStockFormData): Promise<UpdateBatchStockResponse> => {
  try {
    const response = await CoquitoApi.patch<UpdateBatchStockResponse>(
      `/products/batches/${data.batchId}`,
      { 
        stock: data.stock,
        userId: data.userId,
        reason: data.reason,
        notes: data.notes,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al actualizar stock de batch');
    }
    throw new Error('Error desconocido al actualizar batch');
  }
};

/**
 * Elimina un batch
 * DELETE /api/products/batches/:batchId
 */
export const deleteBatch = async (batchId: string): Promise<DeleteBatchResponse> => {
  try {
    const response = await CoquitoApi.delete<DeleteBatchResponse>(`/products/batches/${batchId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al eliminar batch');
    }
    throw new Error('Error desconocido al eliminar batch');
  }
};

