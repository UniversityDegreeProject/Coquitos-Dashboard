export type Role = "Administrador" | "Cajero";

export type Status = "Activo" | "Inactivo" | "Suspendido";

export interface UserResponse {
  id? : string;
  username : string;
  email : string;
  emailVerified? : boolean;
  firstName : string;
  lastName : string;
  phone : string;
  role : Role;
  status : Status;
  password? : string;
  createdAt? : Date;
  updatedAt? : Date;
  lastConnection? : Date;
  token? : string;
  
}

export interface User extends Omit<UserResponse, 'password' | 'token'> {
  isOptimistic? : boolean;
}


export interface UsersResponse {
  users: User[];
}

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
}