import { CoquitoApi } from '@/config/axios.adapter';
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
  } catch (error) {
    throw new Error(`Error al crear cliente: ${error}`);
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
  } catch (error) {
    throw new Error(`Error al actualizar cliente: ${error}`);
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
  } catch (error) {
    throw new Error(`Error al eliminar cliente: ${error}`);
  }
};
