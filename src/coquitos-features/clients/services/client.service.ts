import { CoquitoApi } from '@/config/axios.adapter';
import type {
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
  SearchClientsParams,
  SearchClientsResponse,
  GetClientsResponse,
  GetClientResponse,
  CreateClientResponse,
  UpdateClientResponse,
  DeleteClientResponse,
} from '../interfaces';

/**
 * Servicios para la gestión de clientes
 * Siguiendo el patrón de la API REST
 */

export const getClients = async (): Promise<ClientResponse[]> => {
  try {
    const response = await CoquitoApi.get<GetClientsResponse>('/clients');
    return response.data.clients;
  } catch (error) {
    throw new Error(`Error al obtener clientes: ${error}`);
  }
};

export const getClient = async (id: string): Promise<ClientResponse> => {
  try {
    const response = await CoquitoApi.get<GetClientResponse>(`/clients/${id}`);
    return response.data.client;
  } catch (error) {
    throw new Error(`Error al obtener cliente: ${error}`);
  }
};

export const searchClients = async (params: SearchClientsParams): Promise<ClientResponse[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.documentType) queryParams.append('documentType', params.documentType);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await CoquitoApi.get<SearchClientsResponse>(
      `/clients/search?${queryParams.toString()}`
    );
    return response.data.clients;
  } catch (error) {
    throw new Error(`Error al buscar clientes: ${error}`);
  }
};

export const createClient = async (clientData: CreateClientRequest): Promise<ClientResponse> => {
  try {
    const response = await CoquitoApi.post<CreateClientResponse>('/clients', clientData);
    return response.data.client;
  } catch (error) {
    throw new Error(`Error al crear cliente: ${error}`);
  }
};

export const updateClient = async (id: string, clientData: UpdateClientRequest): Promise<ClientResponse> => {
  try {
    const response = await CoquitoApi.patch<UpdateClientResponse>(`/clients/${id}`, clientData);
    return response.data.client;
  } catch (error) {
    throw new Error(`Error al actualizar cliente: ${error}`);
  }
};

export const deleteClient = async (id: string): Promise<ClientResponse> => {
  try {
    const response = await CoquitoApi.delete<DeleteClientResponse>(`/clients/${id}`);
    return response.data.client;
  } catch (error) {
    throw new Error(`Error al eliminar cliente: ${error}`);
  }
};
