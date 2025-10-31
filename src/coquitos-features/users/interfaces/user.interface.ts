export type Role = "Administrador" | "Cajero";


export type Status = "Activo" | "Inactivo" | "Suspendido";


export interface GetUsersResponse {

  data:         User[];
  total:        number;
  page:         number;
  limit:        number;
  totalPages:   number;
  nextPage:     string | null;
  previousPage: string | null;
}

export interface User {
  id?:            string;
  username:       string;
  email:          string;
  emailVerified:  boolean;
  firstName:      string;
  lastName:       string;
  phone:          string;
  role:           Role;
  status:         Status;
  createdAt?:      Date;
  updatedAt?:      Date;
  lastConnection?: Date;
  isOptimistic?: boolean;
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
  page : number;
  limit : number;
}

export interface CreateUserResponse {
  message : string;
  user : User;
}

export interface UpdateUserResponse {
  message : string;
  user : User;
}

export interface DeleteUserResponse {
  message : string;
  user : User;
}








