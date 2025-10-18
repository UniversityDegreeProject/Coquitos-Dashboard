import { CoquitoApi } from "@/config/axios.adapter"
import { AxiosError } from "axios";
import type { Category, CategoriesResponse } from "../interfaces";

/**
 * Obtiene todas las categorías
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await CoquitoApi.get<CategoriesResponse>('/categories/');
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
    const response = await CoquitoApi.get<{ category: Category }>(`/categories/${categoryId}`);
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
    const response = await CoquitoApi.get<CategoriesResponse>(`/categories/search?search=${search}`);
    return response.data.categories;
  } catch (error) {
    throw new Error(`Error al buscar categorías: ${error}`);
  }
}

/**
 * Crea una nueva categoría
 */
export const createCategory = async (category: Category): Promise<Category> => {
  try {
    const response = await CoquitoApi.post('/categories/', category);
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
export const updateCategory = async (categoryId: string, category: Category): Promise<Category> => {
  try {
    const response = await CoquitoApi.patch(`/categories/${categoryId}`, category);
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
    const response = await CoquitoApi.delete(`/categories/${categoryId}`);
    return response.data.category;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al eliminar categoría');
    }
    throw new Error('Error desconocido');
  }
}

