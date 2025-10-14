import { useQuery } from "@tanstack/react-query"
import { useQuerys } from "../helpers/use-querys"
import { getUsers } from "../services/use.service"


export const useGetUsers = () => {

  const useQueryUsers = useQuery({
    queryKey: useQuerys.allUsers,
    queryFn: () => getUsers(),

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
    enabled: true,
    
  })

  return {
    ...useQueryUsers,
  }
}
