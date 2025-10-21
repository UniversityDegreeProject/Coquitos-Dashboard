import type { UserLoginResponse } from "@/coquitos-features/users/interfaces/user.interface";
import type { UserLoginFormData } from "./user-login-form-data";


export type AuthStatus = "authenticated" | "not-authenticated" | "authenticating" | "logging-out";
/**
 * Estado del store de autenticación (Zustand)
 */
export interface AuthState extends AuthActions {
  status: AuthStatus;
  user: UserLoginResponse | null;
  /** Token de acceso (válido por 1 hora) */
  accessToken: string | null;
  /** Token de refresco (válido por 7 días) */
  refreshToken: string | null;
  error: string | null;

}

/**
 * Acciones del store de autenticación (Zustand)
 */
export interface AuthActions {
  login: (credentials : UserLoginFormData) => void;
  logout: () => void;
  clearError: () => void;
  /** Actualiza los tokens después de un refresh exitoso */
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

