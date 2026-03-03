import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { clientsQueries } from "../const";
import type { GetClientsResponse, SearchClientsParams } from "../interfaces";
import { getClients } from "../services/client.service";

const defaultResponse: GetClientsResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1,
  nextPage: null,
  previousPage: null,
};

export const useGetClients = (params: SearchClientsParams) => {
  const useQueryClients = useQuery<GetClientsResponse>({
    queryKey: clientsQueries.clientsWithFilters(params),
    queryFn: (): Promise<GetClientsResponse> => getClients(params),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });

  const {
    data: clients,
    total,
    page,
    limit,
    totalPages,
    nextPage,
    previousPage,
  } = useQueryClients.data || defaultResponse;

  return {
    ...useQueryClients,
    clients,
    total,
    page,
    limit,
    totalPages,
    nextPage,
    previousPage,
  };
};
