import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useQuerys } from "../const/use-querys";
import { getUsersPaginated } from "../services/use.service";

interface UseUserPaginationParams {
  initialPage?: number;
  initialLimit?: number;
}

export const useUserPagination = ({
  initialPage = 1,
  initialLimit = 7,
}: UseUserPaginationParams = {}) => {
  
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const useQueryPaginatedUsers = useQuery({
    queryKey: useQuerys.usersPaginated({ page, limit }),
    queryFn: () => getUsersPaginated({ page, limit }),
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
    enabled: true,
    placeholderData: (previousData) => previousData, 
  })

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= (useQueryPaginatedUsers.data?.totalPages || 1)) {
      setPage(newPage);
    }
  }, [useQueryPaginatedUsers.data?.totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    if (useQueryPaginatedUsers.data?.totalPages) {
      goToPage(useQueryPaginatedUsers.data.totalPages);
    }
  }, [useQueryPaginatedUsers.data?.totalPages, goToPage]);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); 
  }, []);

  const totalPages = useQueryPaginatedUsers.data?.totalPages || 0;
  const total = useQueryPaginatedUsers.data?.total || 0;
  const users = useQueryPaginatedUsers.data?.users || [];
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    // Data
    users,
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPreviousPage,

    // Estado de carga
    isPending: useQueryPaginatedUsers.isPending,
    isFetching: useQueryPaginatedUsers.isFetching,
    isError: useQueryPaginatedUsers.isError,
    error: useQueryPaginatedUsers.error,

    // Acciones
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changeLimit,

    // Query completa (por si se necesita)
    useQueryPaginatedUsers,
  };
};

