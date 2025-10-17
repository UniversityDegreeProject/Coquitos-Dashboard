export type ClientStatus = "Activo" | "Inactivo" | "Bloqueado";
export type ClientType = "Persona Natural" | "Empresa" | "Cliente VIP";

export interface ClientResponse {
  id?: string;
  name: string;
  document: string;
  documentType?: "CC" | "NIT" | "CE" | "TI" | "PP";
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  department?: string;
  birthday?: Date;
  status: ClientStatus;
  clientType: ClientType;
  totalOrders?: number;
  totalSpent?: number;
  averageOrderValue?: number;
  lastOrderDate?: Date;
  firstOrderDate?: Date;
  loyaltyPoints?: number;
  preferences?: {
    favoriteCategories?: string[];
    allergies?: string[];
    specialRequests?: string;
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Client extends ClientResponse {
  isOptimistic?: boolean;
}

export interface ClientsResponse {
  clients: Client[];
}

export interface ClientFilters {
  search?: string;
  status?: ClientStatus | "";
  clientType?: ClientType | "";
  minTotalSpent?: number;
  maxTotalSpent?: number;
  hasEmail?: boolean;
  hasLoyaltyPoints?: boolean;
}
