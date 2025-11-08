import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
  CreateProductResponse,
  DeleteProductResponse,
  GetProductsResponse,
  Product,
  ProductFormData,
  SearchProductsParams,
  UpdateProductResponse
} from "../interfaces";
import { backendProductToFrontendProduct } from "../mapper/backendProductToFrontendProduct";

/**
 * Obtiene todos los productos
 * GET /api/products
 */
export const getProducts = async ( searchParams : SearchProductsParams): Promise<GetProductsResponse> => {

  const clearParams : Partial<SearchProductsParams> = {
    page: searchParams.page,
    limit: searchParams.limit,
  };

  if( searchParams.search && String(searchParams.search).trim() !== "" ) {
    clearParams.search = searchParams.search;
  }
  if( searchParams.status && String(searchParams.status).trim() !== "" ) {
    clearParams.status = searchParams.status;
  }
  if( searchParams.categoryId && String(searchParams.categoryId).trim() !== "" ) {
    clearParams.categoryId = searchParams.categoryId;
  }
  // lowStock se filtra en el frontend, no se envía al backend

  try {
    const response = await CoquitoApi.get<GetProductsResponse>(`/products`, { params: clearParams });

    const { data :products, ...rest } = response.data;

    return {
      ...rest,
      data: products.map( backendProductToFrontendProduct),
    }
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
export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const response = await CoquitoApi.get<Product>(`/products/${productId}`);
    const product = response.data;

    return {
      ...backendProductToFrontendProduct(product)
    }

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener producto');
    }
    throw new Error('Error desconocido al obtener producto');
  }
};

/**
 * Crea un nuevo producto
 * POST /api/products
 */
export const createProduct = async ( productData: ProductFormData ): Promise<CreateProductResponse> => {
  try {
    const response = await CoquitoApi.post<CreateProductResponse>('/products', productData);
    const { product, message } = response.data;

    return {
      product : backendProductToFrontendProduct(product),
      message
    }

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
export const updateProduct = async ( productId: string, productData: ProductFormData ): Promise<UpdateProductResponse> => {
  try {
    const response = await CoquitoApi.patch<UpdateProductResponse>(`/products/${productId}`, productData);
    const { message, product } = response.data;
    return {
      message,
      product: backendProductToFrontendProduct(product)
    }
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
export const deleteProduct = async (productId: string): Promise<DeleteProductResponse> => {
  try {
    const response = await CoquitoApi.delete<DeleteProductResponse>(`/products/${productId}`);
    const { message, product} = response.data;
    return {
      message,
      product : backendProductToFrontendProduct(product)
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al eliminar producto');
    }
    throw new Error('Error desconocido al eliminar producto');
  }
};

