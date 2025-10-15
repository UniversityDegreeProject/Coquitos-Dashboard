export type Role = "Administrador" | "Cajero";

export type Status = "Activo" | "Inactivo" | "Suspendido";

export interface User {
  id? : string;
  username : string;
  firstName : string;
  lastName : string;
  phone : string;
  email : string;
  password : string;
  role : Role;
  status : Status;
  createdAt : Date;
  updatedAt : Date;
  lastConnection : Date;
}

export interface UserResponse extends User {
  token? : string;
}

