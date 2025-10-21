import { CoquitoApi } from "@/config";
import type { UserResponse } from "@/coquitos-features/users/interfaces/user.interface";
import type { UserLoginFormData } from "../interface";

/**
 * Servicio de autenticación con el backend
 */

/**
 * Inicia sesión con username y password
 * @returns Usuario y tokens (accessToken y refreshToken)
 */
export const login = async ({ username, password }: UserLoginFormData) => {
    const response = await CoquitoApi.post(`/auth/login`, { username, password });
    
    if (!response.data) {
      throw new Error("Respuesta del servidor inválida");
    }
    
    return response.data;
};

/**
 * Renueva el access token usando el refresh token
 * @param refreshToken Token de refresco actual
 * @returns Nuevos tokens (accessToken y refreshToken)
 */
export const refreshAccessToken = async (refreshToken: string): Promise<{
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}> => {
    const response = await CoquitoApi.post(`/auth/refresh-token`, { refreshToken });
    
    if (!response.data) {
      throw new Error("Respuesta del servidor inválida");
    }
    
    return response.data;
};

