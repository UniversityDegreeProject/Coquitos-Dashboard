import { CoquitoApi } from '@/config/axios.adapter';
import type {
  ClientResponse,
  GetClientsResponse,
  ClientFormData
} from '../interfaces';

/**
 * Servicios para la gestión de clientes
 * Siguiendo el patrón de la API REST
 */

export const getClients = async (): Promise<ClientResponse[]> => {
  try {
    const response = await CoquitoApi.get<GetClientsResponse>('/customers');
    return response.data.customers.map( client => ({ customer : client }));
  } catch (error) {
    throw new Error(`Error al obtener clientes: ${error}`);
  }
};

export const getClient = async (id: string): Promise<ClientResponse> => {
  try {
    const response = await CoquitoApi.get<ClientResponse>(`/customers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener cliente: ${error}`);
  }
};

export const searchClients = async (params: ClientFormData): Promise<ClientResponse[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.firstName) queryParams.append('firstName', params.firstName);
    if (params.lastName) queryParams.append('lastName', params.lastName);
    if (params.email) queryParams.append('email', params.email);
    if (params.phone) queryParams.append('phone', params.phone);
    if (params.address) queryParams.append('address', params.address);
    if (params.type) queryParams.append('type', params.type);
    
    const response = await CoquitoApi.get<GetClientsResponse>(
      `/customers/search?${queryParams.toString()}`
    );
    return response.data.customers.map( client => ({ customer : client }));
  } catch (error) {
    throw new Error(`Error al buscar clientes: ${error}`);
  }
};

export const createClient = async (clientData: ClientFormData): Promise<ClientResponse> => {
  try {
    const response = await CoquitoApi.post<ClientResponse>('/customers', clientData);
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear cliente: ${error}`);
  }
};

export const updateClient = async (id: string, clientData: ClientFormData): Promise<ClientResponse> => {
  try {
    const response = await CoquitoApi.patch<ClientResponse>(`/customers/${id}`, clientData);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar cliente: ${error}`);
  }
};

export const deleteClient = async (id: string): Promise<ClientResponse> => {
  try {
    const response = await CoquitoApi.delete<ClientResponse>(`/customers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar cliente: ${error}`);
  }
};
