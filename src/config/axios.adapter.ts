import axios from "axios";
import { getEnvsAdapter } from "./getEnvs.adapter";


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

//* Interceptor para agregar token automáticamente a las peticiones
CoquitoApi.interceptors.request.use(
  (config) => {
    // Obtener token desde el localStorage (Zustand persist lo guarda ahí)
    const authStorage = localStorage.getItem('auth-storage');
    
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        const token = state?.token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error al parsear auth-storage:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//* Interceptor para manejar respuestas de error
CoquitoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido (401), limpiar auth y redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);