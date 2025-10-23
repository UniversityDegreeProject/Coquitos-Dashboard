import type { ClientType } from "../interfaces";

export const querysClient = {
  allClients: ['clients'] as const,
  clientById: (id: string) => [querysClient.allClients, id] as const,
  searchClients: (params: {
    search?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    type?: ClientType;
  }) => [querysClient.allClients, params] as const,
}