import type { SearchClientsParams } from "../interfaces";

export const clientsQueries = {
  allClients: ["clients"] as const,
  clientById: (id: string) => [...clientsQueries.allClients, id] as const,
  clientsWithFilters: (params: SearchClientsParams) =>
    [...clientsQueries.allClients, "filters", params] as const,
};
