import { CoquitoApi } from "@/config/axios.adapter"
import { AxiosError } from "axios";
import type { Category, CategoryFormData, CreateCategoryResponse, DeleteCategoryResponse, GetCategoriesResponse, SearchCategoriesParams, UpdateCategoryResponse } from "../interfaces";
import { backendCategoriesToFrontendCategories } from "../mapper/backendCategoriesToFrontendCategories";



export const getCategories = async ( params : SearchCategoriesParams): Promise<GetCategoriesResponse> => {
  try {
    const cleanParams: Partial<SearchCategoriesParams> = {
      page: params.page,
      limit: params.limit,
    };

    if (params.search && params.search.trim() !== "") {
      cleanParams.search = params.search;
    }
    if (params.status && String(params.status).trim() !== "") {
      cleanParams.status = params.status;
    }


    const response = await CoquitoApi.get<GetCategoriesResponse>('/categories', { params: cleanParams });
    const { data } = response;
    const { data: categories, ...allData } = data;
    return {
      ...allData,
      data : categories.map( backendCategoriesToFrontendCategories ),
    }
  } catch (error) {
    throw new Error(`Error al obtener categorías: ${error}`);
  }
}

export const getCategoryById = async (categoryId: string): Promise<Category> => {
  try {
    const response = await CoquitoApi.get<Category>(`/categories/${categoryId}`);
    const { data : category } = response;
    return backendCategoriesToFrontendCategories( category);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener categoría');
    }
    throw new Error('Error desconocido');
  }
}



export const createCategory = async (category: CategoryFormData): Promise<CreateCategoryResponse> => {
  try {
  const response = await CoquitoApi.post<CreateCategoryResponse>('/categories', category);
    const { data } = response;
    return {
      message : data.message,
      category : backendCategoriesToFrontendCategories( data.category ),
    }
    
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al crear categoría');
    }
    throw new Error('Error desconocido');
  }
}


export const updateCategory = async (categoryId: string, category: CategoryFormData): Promise<UpdateCategoryResponse> => {
  try {
    const response = await CoquitoApi.patch<UpdateCategoryResponse>(`/categories/${categoryId}`, category);
    const { data } = response;
    return {
      message : data.message,
      category : backendCategoriesToFrontendCategories( data.category ),
    }
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al actualizar categoría');
    }
    throw new Error('Error desconocido');
  }
}


export const deleteCategory = async (categoryId: string): Promise<DeleteCategoryResponse> => {
  console.log(categoryId);
  try {
    const response = await CoquitoApi.delete<DeleteCategoryResponse>(`/categories/${categoryId}`);
    const { data } = response;
    return {
      message : data.message,
      category : backendCategoriesToFrontendCategories( data.category ),
    }
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al eliminar categoría');
    }
    throw new Error('Error desconocido');
  }
}



