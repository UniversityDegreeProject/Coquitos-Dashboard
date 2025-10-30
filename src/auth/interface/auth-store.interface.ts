import type { AuthLoginFormData, User } from "./auth.interface";


export type AuthStatus = "authenticated" | "not-authenticated" | "authenticating" | "logging-out";

//* Estado del store de autenticación (Zustand)
export interface AuthState extends AuthActions {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null; //? Token de acceso (válido por 1 hora)
  refreshToken: string | null; //? Token de refresco (válido por 7 días)
  error: string | null; //? Error de autenticación

}

//* Acciones del store de autenticación (Zustand)
export interface AuthActions {
  login: (credentials : AuthLoginFormData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateTokens: (accessToken: string, refreshToken: string, user: User) => void; //? Actualiza los tokens después de un refresh exitoso
}

