

export type ClientType = "Regular" | "VIP" | "Ocasional";


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

export interface ClientResponse {
  message? : string;
  customer : Client;
}

export interface GetClientsResponse {
  customers : Client[];
}

export interface ClientFormData {
  id? : string;
  firstName : string;
  lastName : string;
  email : string;
  phone : string;
  address : string;
  type : ClientType;
}