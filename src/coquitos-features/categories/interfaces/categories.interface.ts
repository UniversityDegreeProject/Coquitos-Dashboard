

export type Status = "Activo" | "Inactivo";

export interface GetCategoriesResponse {
  data:         Category[];
  total:        number;
  page:         number;
  limit:        number;
  totalPages:   number;
  nextPage:     null;
  previousPage: null;
}

export interface Category {
  id?:          string;
  name:        string;
  description: string;
  status:      Status;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface CategoryFormData {
  name: string;
  description: string;
  status: Status;
}


export interface SearchCategoriesParams {
  search?: string;
  status?: Status | "";
  categoryId?: string | "";
  minStock?: number | "";
  page : number;
  limit : number;
}

export interface CreateCategoryResponse {
  message : string;
  category : Category;
}

export interface UpdateCategoryResponse {
  message : string;
  category : Category;
}

export interface DeleteCategoryResponse {
  message : string;
  category : Category;
}