import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { usersQueries } from "../const/users-queries";
import { getUsers } from "../services/use.service";
import type { SearchUsersParams, GetUsersResponse } from "../interfaces";
import { useSocketEvent } from "@/lib/socket";

const defaultResponse: GetUsersResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1,
  nextPage: null,
  previousPage: null,
};

export const useGetUsers = (params: SearchUsersParams) => {
  // Socket.IO: invalidar cache automáticamente cuando el backend emite eventos de usuario
  useSocketEvent("user:created", usersQueries.allUsers);
  useSocketEvent("user:updated", usersQueries.allUsers);
  useSocketEvent("user:deleted", usersQueries.allUsers);
  useSocketEvent("user:online", usersQueries.allUsers);

  const useQueryUsers = useQuery<GetUsersResponse>({
    queryKey: usersQueries.userWithFilters(params),
    queryFn: (): Promise<GetUsersResponse> => getUsers(params),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });

  const {
    data: users,
    total,
    page,
    limit,
    totalPages,
    nextPage,
    previousPage,
  } = useQueryUsers.data || defaultResponse;

  return {
    ...useQueryUsers,
    users,
    total,
    page,
    limit,
    totalPages,
    nextPage,
    previousPage,
    isFetching: useQueryUsers.isFetching,
  };
};
