export type Role = "Administrador" | "Cajero";


export type Status = "Activo" | "Inactivo" | "Suspendido";


export interface UserResponse {
  id?: string;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  lastConnection?: Date;
  accessToken?: string;
  refreshToken?: string;
}


export interface GetUsersResponse {
  users: UserResponse[];
}


export interface SearchUsersResponse {
  users: UserResponse[];
}


export interface UserMutationResponse {
  user: UserResponse;
}




export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  status: Status;
  password?: string;
}

export interface SearchUsersParams {
  search?: string;
  role?: Role | "";
  status?: Status | "";
}




export interface User extends UserResponse {
  id?: string;
  isOptimistic?: boolean;
}


