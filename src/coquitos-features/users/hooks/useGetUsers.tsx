import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { usersQueries } from "../const/users-queries"
import { getUsers } from "../services/use.service"
import type { SearchUsersParams, GetUsersResponse } from "../interfaces"


const defaultResponse: GetUsersResponse = {
  data : [],
  total : 0,
  page : 1,
  limit : 5,
  totalPages : 1,
  nextPage : null,
  previousPage : null,
}

export const useGetUsers = (params: SearchUsersParams) => {

  const useQueryUsers = useQuery<GetUsersResponse>({
    queryKey: usersQueries.userWithFilters(params),
    queryFn: () : Promise<GetUsersResponse> => getUsers(params),
    placeholderData: keepPreviousData, // Mantiene datos anteriores durante refetch
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: true, 
    // Simular socket - refetch cada 3 segundos EN BACKGROUND (sin loader)
    refetchInterval: 3500,
    refetchIntervalInBackground: false,
  })

  const { data: users, total, page, limit, totalPages, nextPage, previousPage } = useQueryUsers.data || defaultResponse;

  return {
    ...useQueryUsers,
    users ,
    total ,
    page ,
    limit ,
    totalPages ,
    nextPage ,
    previousPage ,
  }
} 
