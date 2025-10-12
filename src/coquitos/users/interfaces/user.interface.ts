export type Role = "Administrador" | "Cajero";

export type Status = "Activo" | "Inactivo" | "Suspendido";

export interface User {
  email : string;
  firstName : string;
  lastName : string;
  username : string;
  password : string;
  phone : string;
  role : Role;
  status : Status;

}

export interface UserResponse extends User {
  id? : string;
  token? : string;
}

