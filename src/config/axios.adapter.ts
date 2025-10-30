import axios, { type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";
import { getEnvsAdapter } from "./getEnvs.adapter";
import { useAuthStore } from "@/auth/store/auth.store";
import type { AuthLoginResponse } from "@/auth/interface";

/**
 * Instancia de Axios configurada para la API de Coquito
 * Incluye interceptores para:
 * - Agregar automáticamente el access token
 * - Renovar automáticamente el token cuando expire
 * - Cerrar sesión si el refresh token es inválido
 */
export const CoquitoApi = axios.create({
  baseURL: getEnvsAdapter.API_URL,
  // ¡CORRECCIÓN DE SINTAXIS! 'headers' debe ser un objeto (faltaban las llaves {}).
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  httpsAgent: false,
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

// Variable para evitar múltiples intentos de refresh simultáneos.
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

//* Interceptor para agregar access token automáticamente a las peticiones
CoquitoApi.interceptors.request.use((config) => {
    // 1. Llama al "Cuartel General" (Zustand) para obtener el token.
    const accessToken = useAuthStore.getState().accessToken;

    // 2. Si el token existe (estamos logueados)...
    if (accessToken) {
      // 3. ...lo adjuntamos a la cabecera de la petición.
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 4. Dejamos que la petición continúe.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//* Interceptor para manejar respuestas de error y renovación automática de tokens.
  CoquitoApi.interceptors.response.use((response : AxiosResponse) => response, async (error : AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si el error es 401 (Token Expirado) y no es un reintento.
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si ya estamos renovando el token, pone esta petición en la cola de espera.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(() => {
            return CoquitoApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true; // Activa el "semáforo" (¡Ocupado!)

      // ¡Correcto! Obtiene el refresh token desde Zustand.
      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        // No hay refresh token, le dice a Zustand que cierre sesión.
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        // Intentar renovar el token.
        // ¡CORRECCIÓN DE SINTAXIS! Así se llama a axios.post.
        const response = await axios.post<AuthLoginResponse>(
          `${getEnvsAdapter.API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user,
        } = response.data;

        // ¡Correcto! Le dice a Zustand que actualice todo.
        useAuthStore
          .getState()
          .updateTokens(newAccessToken, newRefreshToken, user);

        // Actualizar el header de la petición original.
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Procesar todas las peticiones que estaban en cola.
        failedRequestsQueue.forEach((request) => {
          request.resolve();
        });
        failedRequestsQueue = [];

        // Reintentar la petición original (ahora con el token nuevo).
        return CoquitoApi(originalRequest);
      } catch (refreshError) {
        // Falló la renovación del token (ej. el refresh token también expiró).
        failedRequestsQueue.forEach((request) => {
          request.reject(refreshError);
        });
        failedRequestsQueue = [];

        // ¡Correcto! Le dice a Zustand que cierre sesión.
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Libera el "semáforo" (¡Libre!)
      }
    }

    // Si no es un error 401, simplemente rechaza el error.
    return Promise.reject(error);
  }
);