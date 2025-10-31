import { useEffect, useRef, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useUserActivity } from './useUserActivity';
import { useAuthStore } from '@/auth/store/auth.store';
import { refreshAccessToken } from '@/auth/services/auth.service';
import { toast } from 'sonner';

interface JWTPayload {
  id: string;
  exp: number;
}

interface UseTokenRefreshOptions {
  renewBeforeExpiry?: number;
  inactivityTimeout?: number;
  checkInterval?: number;
}

/**
 * Hook que coordina la renovación automática de tokens con detección de inactividad
 * 
 * Comportamiento:
 * - Si el usuario está activo y el token está por expirar → Renueva automáticamente
 * - Si el usuario está inactivo y el token expira → Cierra sesión automáticamente
 * - Si hay un error 401 mientras el usuario trabaja → El interceptor de Axios renovará el token
 * 
 * @param options Opciones de configuración
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {

  const { renewBeforeExpiry = 5, inactivityTimeout = 5, checkInterval = 2 } = options;

  const { accessToken, refreshToken, updateTokens, logout, status } = useAuthStore();

  const isRenewingRef = useRef(false);
  const inactivityLogoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Decodifica el token y obtiene el tiempo de expiración
   */
  const getTokenExpirationTime = useCallback((token: string): number | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.exp * 1000;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }, []);

  /**
   * Verifica si el token está por expirar
   */
  const isTokenExpiringSoon = useCallback((token: string): boolean => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return false;

    const now = Date.now();
    const timeUntilExpiry = expirationTime - now;
    const renewThreshold = renewBeforeExpiry * 60 * 1000; // Convertir minutos a ms

    return timeUntilExpiry <= renewThreshold && timeUntilExpiry > 0;
  }, [getTokenExpirationTime, renewBeforeExpiry]);

  /**
   * Verifica si el token ya expiró
   */
  const isTokenExpired = useCallback((token: string): boolean => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return true;

    return Date.now() >= expirationTime;
  }, [getTokenExpirationTime]);


  /**
   * Callback cuando el usuario se vuelve inactivo
   */
  const onUserInactive = useCallback(() => {
    
    // Verificar el estado del token cuando el usuario se vuelve inactivo
    const currentToken = useAuthStore.getState().accessToken;
    if (!currentToken) return;
    
    const expirationTime = getTokenExpirationTime(currentToken);
    
    if (isTokenExpired(currentToken)) {
      logout();
      toast.info('Se ha cerrado la sesion por inactividad y seguridad, por favor, inicia sesión nuevamente.');
      return;
    }
    
    // Si el token está válido, programar cierre de sesión para cuando expire
    if (expirationTime) {
      const timeUntilExpiry = expirationTime - Date.now();
      
      // Limpiar cualquier timer anterior
      if (inactivityLogoutTimerRef.current) {
        clearTimeout(inactivityLogoutTimerRef.current);
      }
      
      // Programar cierre de sesión para cuando el token expire
      inactivityLogoutTimerRef.current = setTimeout(() => {
        logout();
        toast.info('Sesión cerrada por inactividad y seguridad, por favor, inicia sesión nuevamente.');
      }, timeUntilExpiry);
    }
  }, [isTokenExpired, getTokenExpirationTime, logout]);

  /**
   * Callback cuando el usuario se reactiva después de estar inactivo
   */
  const onUserActive = useCallback(() => {
    
    // Cancelar cualquier cierre de sesión programado
    if (inactivityLogoutTimerRef.current) {
      clearTimeout(inactivityLogoutTimerRef.current);
      inactivityLogoutTimerRef.current = null;
    }
  }, []);

  // Usar el hook de detección de actividad
  const { isUserActive } = useUserActivity({
    inactivityTimeout: inactivityTimeout * 60 * 1000, // Convertir minutos a ms
    onInactive: onUserInactive,
    onActive: onUserActive,
  });

  /**
   * Renueva el token de acceso
   */
  const onRenewToken = useCallback(async () => {
    if (!refreshToken || isRenewingRef.current) {
      return;
    }

    isRenewingRef.current = true;

    try {
      const response = await refreshAccessToken(refreshToken);
      
      // Actualizar tokens en el store
      updateTokens(response.accessToken, response.refreshToken, response.user);
      
    } catch (error) {
      console.error('Error al renovar el token:', error);
      logout();
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    } finally {
      isRenewingRef.current = false;
    }
  }, [refreshToken, updateTokens, logout]);

  /**
   * Verifica el estado del token periódicamente
   */
  const checkTokenStatus = useCallback(() => {
    // Solo verificar si el usuario está autenticado
    if (status !== 'authenticated' || !accessToken) {
      return;
    }

    const userActive = isUserActive();


    // Si el token ya expiró
    if (isTokenExpired(accessToken)) {
      
      logout();
      toast.info('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      return;
    }

    // Si el token está por expirar y el usuario está activo
    if (isTokenExpiringSoon(accessToken)) {
      if (userActive) {
        onRenewToken();
      }
    }
  }, [ status, accessToken, isTokenExpired, isTokenExpiringSoon, isUserActive, onRenewToken, logout ]);

  //* Verificar el estado del token periódicamente
  useEffect(() => {
    //? Verificar inmediatamente
    checkTokenStatus();

    //? Configurar intervalo de verificación
    const interval = setInterval(() => {
      checkTokenStatus();
    }, checkInterval * 60 * 1000);

    return () => {
      clearInterval(interval);
      
      //? Limpiar timer de cierre de sesión por inactividad
      if (inactivityLogoutTimerRef.current) {
        clearTimeout(inactivityLogoutTimerRef.current);
      }
    };
  }, [checkTokenStatus, checkInterval]);

  return {
    /** Indica si el token está por expirar */
    isExpiringSoon: accessToken ? isTokenExpiringSoon(accessToken) : false,
    /** Indica si el token ya expiró */
    isExpired: accessToken ? isTokenExpired(accessToken) : false,
    /** Fuerza una renovación manual del token */
    forceRenew: onRenewToken,
  };
};

