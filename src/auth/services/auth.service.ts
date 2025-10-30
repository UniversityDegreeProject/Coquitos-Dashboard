import { CoquitoApi } from "@/config";
import type { AuthLoginFormData, AuthLoginResponse } from "../interface";



/**
 * Inicia sesión con username y password
 * @returns AuthLoginResponse { user: User, accessToken: string, refreshToken: string }
 */
export const login = async ({ username, password }: AuthLoginFormData): Promise<AuthLoginResponse> => {
    const response = await CoquitoApi.post<AuthLoginResponse>(`/auth/login`, { username, password });

    
    return response.data;
};

/**
 * Renueva el access token usando el refresh token
 * @param refreshToken Token de refresco actual
 * @returns AuthLoginResponse { user: User, accessToken: string, refreshToken: string }
 */
export const refreshAccessToken = async (refreshToken: string): Promise<AuthLoginResponse> => {
    const response = await CoquitoApi.post<AuthLoginResponse>(`/auth/refresh-token`, { refreshToken });

    
    return response.data;
};

