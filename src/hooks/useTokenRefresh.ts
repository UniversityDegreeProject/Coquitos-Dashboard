import { useEffect, useRef, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useUserActivity } from './useUserActivity';
import { useAuthStore } from '@/auth/store/auth.store';
import { refreshAccessToken } from '@/auth/services/auth.service';
import { toast } from 'sonner';

interface JWTPayload {
  /** ID del usuario */
  id: string;
  /** Username */
  username: string;
  /** Email */
  email: string;
  /** Rol */
  role: string;
  /** Fecha de emisión (timestamp en segundos) */
  iat: number;
  /** Fecha de expiración (timestamp en segundos) */
  exp: number;
}

interface UseTokenRefreshOptions {
  /**
   * Tiempo en minutos antes de que expire el token para renovarlo proactivamente
   * Por defecto: 5 minutos
   */
  renewBeforeExpiry?: number;
  /**
   * Tiempo en minutos de inactividad antes de considerar al usuario inactivo
   * Por defecto: 10 minutos
   */
  inactivityTimeout?: number;
  /**
   * Intervalo en minutos para verificar el estado del token
   * Por defecto: 1 minuto
   */
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
  const {
    renewBeforeExpiry = 5, // 5 minutos antes de expirar
    inactivityTimeout = 10, // 10 minutos de inactividad
    checkInterval = 1, // Verificar cada 1 minuto
  } = options;

  const { accessToken, refreshToken, updateTokens, logout, status } = useAuthStore();
  const isRenewingRef = useRef(false);

  /**
   * Decodifica el token y obtiene el tiempo de expiración
   */
  const getTokenExpirationTime = useCallback((token: string): number | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.exp * 1000; // Convertir a milisegundos
    } catch (error) {
      console.error('Error al decodificar token:', error);
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
    console.log('[TokenRefresh] ⚠️ Usuario inactivo detectado');
    
    // Si el token ya expiró o está por expirar, cerrar sesión
    const currentToken = useAuthStore.getState().accessToken;
    if (currentToken && isTokenExpired(currentToken)) {
      console.log('[TokenRefresh] 🚪 Token expirado con usuario inactivo - Cerrando sesión');
      logout();
      toast.info('Sesión cerrada por inactividad');
    }
  }, [isTokenExpired, logout]);

  /**
   * Callback cuando el usuario se reactiva después de estar inactivo
   */
  const onUserActive = useCallback(() => {
    console.log('[TokenRefresh] ✅ Usuario activo nuevamente');
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
      console.log('[TokenRefresh] Renovando token proactivamente...');
      const response = await refreshAccessToken(refreshToken);
      
      // Actualizar tokens en el store
      updateTokens(response.accessToken, response.refreshToken);
      
      console.log('[TokenRefresh] Token renovado exitosamente');
    } catch (error) {
      console.error('[TokenRefresh] Error al renovar token:', error);
      
      // Si falla la renovación, cerrar sesión
      logout();
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    } finally {
      isRenewingRef.current = false;
    }
  }, [refreshToken, updateTokens, logout]);

  /**
   * Obtiene el tiempo restante del token en formato legible
   */
  const getTimeUntilExpiry = useCallback((token: string): string => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return 'Token inválido';

    const now = Date.now();
    const timeLeft = expirationTime - now;

    if (timeLeft <= 0) return 'Expirado';

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [getTokenExpirationTime]);

  /**
   * Verifica el estado del token periódicamente
   */
  const checkTokenStatus = useCallback(() => {
    // Solo verificar si el usuario está autenticado
    if (status !== 'authenticated' || !accessToken) {
      console.log('[TokenRefresh] ⏸️ No autenticado - Sistema en espera');
      return;
    }

    const userActive = isUserActive();
    const timeLeft = getTimeUntilExpiry(accessToken);

    console.log(`[TokenRefresh] 🔍 Verificación periódica:
      ⏰ Tiempo restante del token: ${timeLeft}
      👤 Usuario ${userActive ? '✅ ACTIVO' : '❌ INACTIVO'}
      📊 Estado: ${status}`);

    // Si el token ya expiró
    if (isTokenExpired(accessToken)) {
      console.log('[TokenRefresh] ⚠️ Token expirado');
      
      // Si el usuario está inactivo, cerrar sesión
      if (!userActive) {
        console.log('[TokenRefresh] 🚪 Usuario inactivo - Cerrando sesión');
        logout();
        toast.info('Sesión cerrada por inactividad');
      } else {
        console.log('[TokenRefresh] ℹ️ Usuario activo - El interceptor renovará en la próxima petición');
      }
      return;
    }

    // Si el token está por expirar y el usuario está activo
    if (isTokenExpiringSoon(accessToken)) {
      if (userActive) {
        console.log('[TokenRefresh] 🔄 Token por expirar con usuario activo - Renovando proactivamente');
        onRenewToken();
      } else {
        console.log(`[TokenRefresh] ⏳ Token por expirar (${timeLeft}) pero usuario INACTIVO - No se renovará`);
      }
    } else {
      console.log(`[TokenRefresh] ✅ Token válido por ${timeLeft} más`);
    }
  }, [
    status,
    accessToken,
    isTokenExpired,
    isTokenExpiringSoon,
    isUserActive,
    onRenewToken,
    logout,
    getTimeUntilExpiry,
  ]);

  // Verificar el estado del token periódicamente
  useEffect(() => {
    // Verificar inmediatamente
    checkTokenStatus();

    // Configurar intervalo de verificación
    const interval = setInterval(() => {
      checkTokenStatus();
    }, checkInterval * 60 * 1000); // Convertir minutos a ms

    return () => {
      clearInterval(interval);
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

