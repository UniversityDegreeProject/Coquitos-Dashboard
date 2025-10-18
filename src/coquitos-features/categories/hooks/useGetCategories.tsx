import { useQuery } from "@tanstack/react-query"
import { useQuerys } from "../const/use-querys"
import { getCategories } from "../services/category.service"

/**
 * Hook para obtener todas las categorías
 */
export const useGetCategories = () => {
  const useQueryCategories = useQuery({
    queryKey: useQuerys.allCategories,
    queryFn: () => getCategories(),

    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
    enabled: true,
  })

  return {
    ...useQueryCategories,
  }
}

