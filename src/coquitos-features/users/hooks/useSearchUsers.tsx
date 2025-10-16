import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQuerys } from "../const/use-querys";
import { searchUsers } from "../services/use.service";
import type { User, Role, Status } from "../interfaces";
import { useGetUsers } from "./useGetUsers";

interface UseUserSearchParams {
  search?: string;
  role?: Role | "";
  status?: Status | "";
}

/**
 * Hook que maneja la búsqueda y filtrado de usuarios
 * Combina búsqueda del servidor con filtros locales para mejor UX
 */
export const useUserSearch = ({ search = "", role = "", status = "" }: UseUserSearchParams) => {
  const { data: allUsers = [], isLoading: isLoadingAll } = useGetUsers();

  // Query para búsqueda por texto (solo si hay texto)
  const { data: searchResults = [], isLoading: isLoadingSearch } = useQuery({
    queryKey: useQuerys.searchUsers({ search }),
    queryFn: () => searchUsers(search),
    enabled: search.trim().length > 0, 
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: false,
  });

  // Determinar qué datos usar como base
  const baseUsers = search.trim().length > 0 ? searchResults : allUsers;

  // *Filtros locales
  const filteredUsers = useMemo(() => {
    return baseUsers.filter((user: User) => {
      if (role && user.role !== role) return false;

      if (status && user.status !== status) return false;
      
      return true;
    });
  }, [baseUsers, role, status]);

  // *Estado de carga
  const isLoading = search.trim().length > 0 ? isLoadingSearch : isLoadingAll;

  return {
    users: filteredUsers,
    isLoading,
    hasFilters: search.trim().length > 0 || role !== "" || status !== "",
  };
};

