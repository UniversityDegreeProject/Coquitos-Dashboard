import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { usersQueries } from "../const/users-queries";
import { getUserById } from "../services/use.service";
import type { User } from "../interfaces/user.interface";


export const useGetUserById = () => {

  const { userId } = useParams<{ userId: string }>();

  const useGetUserById = useQuery<User>({
    queryKey: usersQueries.userById(userId as string),
    queryFn: () : Promise<User> => getUserById(userId as string),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: true,
  })

  return {
    ...useGetUserById,
    user: useGetUserById.data,
  }
}
