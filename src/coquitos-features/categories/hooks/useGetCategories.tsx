import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { categoriesQueries } from "../const"
import { getCategories } from "../services/category.service"
import type { SearchCategoriesParams, GetCategoriesResponse } from "../interfaces"


const defaultResponse: GetCategoriesResponse = {
  data : [],
  total : 0,
  page : 1,
  limit : 5,
  totalPages : 1,
  nextPage : null,
  previousPage : null,
}

export const useGetCategories = (params: SearchCategoriesParams) => {

  const useQueryCategories = useQuery<GetCategoriesResponse>({
    queryKey: categoriesQueries.categoryWithFilters(params),
    queryFn: () : Promise<GetCategoriesResponse> => getCategories(params),
    placeholderData: keepPreviousData, // Mantiene datos anteriores durante refetch
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: true, 
    // Simular socket - refetch cada 3 segundos EN BACKGROUND (sin loader)
    refetchInterval: 4500,
    refetchIntervalInBackground: false,
  })

  const { data: categories, total, page, limit, totalPages, nextPage, previousPage } = useQueryCategories.data || defaultResponse;

  return {
    ...useQueryCategories,
    categories ,
    total ,
    page ,
    limit ,
    totalPages ,
    nextPage ,
    previousPage ,
  }
} 
