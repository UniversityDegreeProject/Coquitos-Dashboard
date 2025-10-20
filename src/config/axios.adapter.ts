import axios, { type InternalAxiosRequestConfig } from "axios";
import { getEnvsAdapter } from "./getEnvs.adapter";

/**
 * Instancia de Axios configurada para la API de Coquito
 * Incluye interceptores para:
 * - Agregar automáticamente el access token
 * - Renovar automáticamente el token cuando expire
 * - Cerrar sesión si el refresh token es inválido
 */
export const CoquitoApi = axios.create({
  baseURL: getEnvsAdapter.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  httpsAgent: false,
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

// Variable para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Obtiene los datos de autenticación del localStorage
 */
const getAuthStorage = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return state;
    }
  } catch (error) {
    console.error('Error al parsear auth-storage:', error);
  }
  return null;
};

/**
 * Actualiza los tokens en el localStorage
 */
const updateAuthStorage = (accessToken: string, refreshToken: string) => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      parsed.state.accessToken = accessToken;
      parsed.state.refreshToken = refreshToken;
      localStorage.setItem('auth-storage', JSON.stringify(parsed));
    }
  } catch (error) {
    console.error('Error al actualizar auth-storage:', error);
  }
};

/**
 * Limpia la autenticación y redirige al login
 */
const clearAuthAndRedirect = () => {
  localStorage.removeItem('auth-storage');
  window.location.href = '/login';
};

//* Interceptor para agregar access token automáticamente a las peticiones
CoquitoApi.interceptors.request.use(
  (config) => {
    const authState = getAuthStorage();
    const accessToken = authState?.accessToken;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//* Interceptor para manejar respuestas de error y renovación automática de tokens
CoquitoApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no es un intento de renovación de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si ya estamos renovando el token, agregar la petición a la cola
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
      isRefreshing = true;

      const authState = getAuthStorage();
      const refreshToken = authState?.refreshToken;

      if (!refreshToken) {
        // No hay refresh token, cerrar sesión
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        // Intentar renovar el token
        const response = await axios.post(
          `${getEnvsAdapter.API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Actualizar tokens en localStorage
        updateAuthStorage(newAccessToken, newRefreshToken);

        // Actualizar el header de la petición original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Procesar todas las peticiones que estaban en cola
        failedRequestsQueue.forEach((request) => {
          request.resolve();
        });
        failedRequestsQueue = [];

        // Reintentar la petición original
        return CoquitoApi(originalRequest);
      } catch (refreshError) {
        // Falló la renovación del token, cerrar sesión
        failedRequestsQueue.forEach((request) => {
          request.reject(refreshError);
        });
        failedRequestsQueue = [];
        
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);