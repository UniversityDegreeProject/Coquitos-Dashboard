/**
 * Interfaces para la gestión de clientes
 * Siguiendo el patrón de la API REST
 */

export interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  documentType: 'CI' | 'NIT' | 'PASSPORT';
  documentNumber: string;
  status: 'Activo' | 'Inactivo';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  documentType: 'CI' | 'NIT' | 'PASSPORT';
  documentNumber: string;
  status?: 'Activo' | 'Inactivo';
  notes?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  documentType?: 'CI' | 'NIT' | 'PASSPORT';
  documentNumber?: string;
  status?: 'Activo' | 'Inactivo';
  notes?: string;
}

export interface SearchClientsParams {
  search?: string;
  status?: 'Activo' | 'Inactivo';
  documentType?: 'CI' | 'NIT' | 'PASSPORT';
  page?: number;
  limit?: number;
}

export interface SearchClientsResponse {
  clients: ClientResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetClientsResponse {
  clients: ClientResponse[];
}

export interface GetClientResponse {
  client: ClientResponse;
}

export interface CreateClientResponse {
  message: string;
  client: ClientResponse;
}

export interface UpdateClientResponse {
  message: string;
  client: ClientResponse;
}

export interface DeleteClientResponse {
  message: string;
  client: ClientResponse;
}