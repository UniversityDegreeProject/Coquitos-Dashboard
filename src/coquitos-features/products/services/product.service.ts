import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
  ProductResponse,
  ProductFormData,
  GetProductsResponse,
  SearchProductsParams,
  SearchProductsResponse,
  ProductMutationResponse
} from "../interfaces";

/**
 * Obtiene todos los productos
 * GET /api/products
 */
export const getProducts = async (): Promise<ProductResponse[]> => {
  try {
    const response = await CoquitoApi.get<GetProductsResponse>('/products');
    return response.data.products;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener productos');
    }
    throw new Error('Error desconocido al obtener productos');
  }
};

/**
 * Obtiene un producto por su ID
 * GET /api/products/:id
 */
export const getProductById = async (productId: string): Promise<ProductResponse> => {
  try {
    const response = await CoquitoApi.get<{ product: ProductResponse }>(`/products/${productId}`);
    return response.data.product;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener producto');
    }
    throw new Error('Error desconocido al obtener producto');
  }
};

/**
 * Busca productos con filtros avanzados
 * GET /api/products/search
 */
export const searchProducts = async (
  params: SearchProductsParams
): Promise<SearchProductsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.status) queryParams.append('status', params.status);
    if (params.lowStock !== undefined) queryParams.append('lowStock', params.lowStock.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await CoquitoApi.get<SearchProductsResponse>(
      `/products/search?${queryParams.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al buscar productos');
    }
    throw new Error('Error desconocido al buscar productos');
  }
};

/**
 * Crea un nuevo producto
 * POST /api/products
 */
export const createProduct = async ( productData: ProductFormData ): Promise<ProductResponse> => {
  try {
    const response = await CoquitoApi.post<ProductMutationResponse>('/products', productData);
    return response.data.product;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al crear producto');
    }
    throw new Error('Error desconocido al crear producto');
  }
};

/**
 * Actualiza un producto existente
 * PATCH /api/products/:id
 */
export const updateProduct = async ( productId: string, productData: Partial<ProductFormData> ): Promise<ProductResponse> => {
  try {
    const response = await CoquitoApi.patch<ProductMutationResponse>(`/products/${productId}`, productData);
    return response.data.product;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al actualizar producto');
    }
    throw new Error('Error desconocido al actualizar producto');
  }
};

/**
 * Elimina un producto
 * DELETE /api/products/:id
 */
export const deleteProduct = async (productId: string): Promise<ProductResponse> => {
  try {
    const response = await CoquitoApi.delete<ProductMutationResponse>(`/products/${productId}`);
    return response.data.product;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al eliminar producto');
    }
    throw new Error('Error desconocido al eliminar producto');
  }
};

