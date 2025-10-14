import type { User } from "@/coquitos-features/users/interfaces/user.interface";
import type { UserLoginFormData } from "./user-login-form-data";


export type AuthStatus = "authenticated" | "not-authenticated" | "authenticating";
/**
 * Estado del store de autenticación (Zustand)
 */
export interface AuthState extends AuthActions {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  error: string | null;

}

/**
 * Acciones del store de autenticación (Zustand)
 */
export interface AuthActions {
  login: (credentials : UserLoginFormData) => void;
  logout: () => void;
  clearError: () => void;
}

