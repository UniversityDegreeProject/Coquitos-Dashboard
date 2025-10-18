import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQuerys } from "../const/use-querys";
import { searchCategories } from "../services/category.service";
import type { Category, CategoryStatus } from "../interfaces";
import { useGetCategories } from "./useGetCategories";

interface UseCategorySearchParams {
  search?: string;
  status?: CategoryStatus | "";
}


export const useCategorySearch = ({ search = "", status = "" }: UseCategorySearchParams) => {
  
  const { data: allCategories = [], isLoading: isLoadingAll } = useGetCategories();

  // Query para búsqueda por texto (solo si hay texto)
  const { data: searchResults = [], isLoading: isLoadingSearch } = useQuery({
    queryKey: useQuerys.searchCategories({ search }),
    queryFn: () => searchCategories(search),
    enabled: search.trim().length > 0, 
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: false,
  });

  // Determinar qué datos usar como base
  const baseCategories = search.trim().length > 0 ? searchResults : allCategories;

  // *Filtros locales
  const filteredCategories = useMemo(() => {
    return baseCategories.filter((category: Category) => {
      if (status && category.status !== status) return false;
      return true;
    });
  }, [baseCategories, status]);

  // *Estado de carga
  const isLoading = search.trim().length > 0 ? isLoadingSearch : isLoadingAll;

  return {
    categories: filteredCategories,
    isLoading,
    hasFilters: search.trim().length > 0 || status !== "",
  };
};

