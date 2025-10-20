import { CoquitoApi } from "@/config/axios.adapter"
import { AxiosError } from "axios";
import type { 
  Category, 
  GetCategoriesResponse, 
  SearchCategoriesResponse,
  CategoryMutationResponse,
  CategoryFormData
} from "../interfaces";

/**
 * Obtiene todas las categorías
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await CoquitoApi.get<GetCategoriesResponse>('/categories/');
    return response.data.categories;
  } catch (error) {
    throw new Error(`Error al obtener categorías: ${error}`);
  }
}

/**
 * Obtiene una categoría por su ID
 */
export const getCategoryById = async (categoryId: string): Promise<Category> => {
  try {
    const response = await CoquitoApi.get<CategoryMutationResponse>(`/categories/${categoryId}`);
    return response.data.category;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener categoría');
    }
    throw new Error('Error desconocido');
  }
}

/**
 * Busca categorías por término de búsqueda
 */
export const searchCategories = async (search: string): Promise<Category[]> => {
  try {
    const response = await CoquitoApi.get<SearchCategoriesResponse>(`/categories/search?search=${search}`);
    return response.data.categories;
  } catch (error) {
    throw new Error(`Error al buscar categorías: ${error}`);
  }
}

/**
 * Crea una nueva categoría
 */
export const createCategory = async (categoryData: CategoryFormData): Promise<Category> => {
  try {
    const response = await CoquitoApi.post<CategoryMutationResponse>('/categories/', categoryData);
    return response.data.category;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al crear categoría');
    }
    throw new Error('Error desconocido');
  }
}

/**
 * Actualiza una categoría existente
 */
export const updateCategory = async (categoryId: string, categoryData: CategoryFormData): Promise<Category> => {
  try {
    const response = await CoquitoApi.patch<CategoryMutationResponse>(`/categories/${categoryId}`, categoryData);
    return response.data.category;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al actualizar categoría');
    }
    throw new Error('Error desconocido');
  }
}

/**
 * Elimina una categoría
 */
export const deleteCategory = async (categoryId: string): Promise<Category> => {
  try {
    const response = await CoquitoApi.delete<CategoryMutationResponse>(`/categories/${categoryId}`);
    return response.data.category;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al eliminar categoría');
    }
    throw new Error('Error desconocido');
  }
}

