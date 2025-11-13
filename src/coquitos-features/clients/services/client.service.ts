import { CoquitoApi } from '@/config/axios.adapter';
import { AxiosError } from 'axios';
import type {
  GetClientsResponse,
  ClientFormData,
  SearchClientsParams,
  Client
} from '../interfaces';
import { backendClientToFrontendClient } from '../mapper/backendClientToFrontendClient';
import type { CreateClientResponse, DeleteClientResponse, UpdateClientResponse } from '../interfaces/client.interface';

/**
 * Servicios para la gestión de clientes
 * Siguiendo el patrón de la API REST
 */

export const getClients = async ( params : SearchClientsParams ): Promise<GetClientsResponse> => {

  const clearParams : Partial<SearchClientsParams> = {
    page : params.page,
    limit : params.limit
  }

  if (params.search) clearParams.search = params.search;
  if (params.type) clearParams.type = params.type;


  try {
    const response = await CoquitoApi.get<GetClientsResponse>('/customers', { params : clearParams });
    const { data : clients, ...rest } = response.data;
    return {
      data: clients.map(backendClientToFrontendClient),
      ...rest,
    };
  } catch (error) {
    throw new Error(`Error al obtener clientes: ${error}`);
  }
};



export const getClientById = async ( id : string ): Promise<Client> => {

  try {
    const response = await CoquitoApi.get<{ customer : Client}>(`/customers/${id}`);
    const { customer } = response.data;
    return backendClientToFrontendClient( customer );

  } catch (error) {
    throw new Error(`Error al obtener cliente: ${error}`);
  }

}


export const createClient = async (clientData: ClientFormData): Promise<CreateClientResponse> => {
  try {
    const response = await CoquitoApi.post<CreateClientResponse>('/customers', clientData);
    const { customer } = response.data;
    return {
      message: response.data.message,
      customer: backendClientToFrontendClient(customer),
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Error al crear cliente');
    }
    throw new Error('Error desconocido al crear cliente');
  }
};

export const updateClient = async (id: string, clientData: ClientFormData): Promise<UpdateClientResponse> => {
  try {
    const response = await CoquitoApi.patch<UpdateClientResponse>(`/customers/${id}`, clientData);
    const { customer } = response.data;
    return {
      message: response.data.message,
      customer: backendClientToFrontendClient(customer),
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Error al actualizar cliente');
    }
    throw new Error('Error desconocido al actualizar cliente');
  }
};

export const deleteClient = async (id: string): Promise<DeleteClientResponse> => {
  try {
    const response = await CoquitoApi.delete<DeleteClientResponse>(`/customers/${id}`);
    const { customer } = response.data;
    return {
      message: response.data.message,
      customer: backendClientToFrontendClient(customer),
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Error al eliminar cliente');
    }
    throw new Error('Error desconocido al eliminar cliente');
  }
};
