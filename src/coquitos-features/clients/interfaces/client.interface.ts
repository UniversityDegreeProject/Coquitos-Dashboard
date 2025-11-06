

export type ClientType = "Regular" | "VIP" | "Ocasional";

export interface GetClientsResponse {
  data:         Client[];
  total:        number;
  page:         number;
  limit:        number;
  totalPages:   number;
  nextPage:     string | null;
  previousPage: string | null;
}

export interface Client {
  id? : string;
  firstName : string;
  lastName : string;
  email : string;
  phone : string;
  address : string;
  type : ClientType;
  createdAt? : Date;
  updatedAt? : Date;
}

export interface ClientFormData {
  firstName : string;
  lastName : string;
  email : string;
  phone : string;
  address : string;
  type : ClientType;
}

export interface SearchClientsParams {
  search?: string | "";
  type?: ClientType | "";
  page : number;
  limit : number;
}

export interface CreateClientResponse {
  message : string;
  customer : Client;
}

export interface UpdateClientResponse {
  message : string;
  customer : Client;
}

export interface DeleteClientResponse {
  message : string;
  customer : Client;
}