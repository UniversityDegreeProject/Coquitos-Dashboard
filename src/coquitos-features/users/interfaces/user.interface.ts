/**
 * ========================================
 * TIPOS Y ENUMS
 * ========================================
 */

/**
 * Rol de un usuario en el sistema
 */
export type Role = "Administrador" | "Cajero";

/**
 * Estado de un usuario
 */
export type Status = "Activo" | "Inactivo" | "Suspendido";

/**
 * ========================================
 * INTERFACES DE RESPUESTA DEL BACKEND
 * ========================================
 */

/**
 * Respuesta del backend para un usuario individual
 */
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
  lastConnection?: string;
}

/**
 * Respuesta del backend con lista de usuarios
 */
export interface GetUsersResponse {
  users: UserResponse[];
}

/**
 * Respuesta del backend para búsqueda de usuarios
 */
export interface SearchUsersResponse {
  users: UserResponse[];
}

/**
 * Respuesta del backend para mutaciones (create, update, delete)
 */
export interface UserMutationResponse {
  user: UserResponse;
}

/**
 * ========================================
 * INTERFACES PARA FORMULARIOS Y DATOS
 * ========================================
 */

/**
 * Datos del formulario para crear/actualizar usuario
 */
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

/**
 * Parámetros para búsqueda de usuarios
 */
export interface SearchUsersParams {
  search?: string;
  role?: Role | "";
  status?: Status | "";
}

/**
 * ========================================
 * INTERFACES EXTENDIDAS PARA UI
 * ========================================
 */

/**
 * Interfaz extendida de usuario con campos opcionales de UI
 */
export interface User extends UserResponse {
  isOptimistic?: boolean;
}


