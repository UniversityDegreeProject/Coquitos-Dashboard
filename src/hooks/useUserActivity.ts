import { useEffect, useRef, useCallback } from 'react';

interface UseUserActivityOptions {
  /**
   * Tiempo en milisegundos que se considera inactividad
   * Por defecto: 10 minutos (600000 ms)
   */
  inactivityTimeout?: number;
  /**
   * Callback que se ejecuta cuando se detecta inactividad
   */
  onInactive?: () => void;
  /**
   * Callback que se ejecuta cuando se detecta actividad después de estar inactivo
   */
  onActive?: () => void;
}

/**
 * Hook para detectar actividad e inactividad del usuario
 * Escucha eventos de mouse, teclado y touch para determinar si el usuario está activo
 */
export const useUserActivity = (options: UseUserActivityOptions = {}) => {
  const {
    inactivityTimeout = 10 * 60 * 1000, // 10 minutos por defecto
    onInactive,
    onActive,
  } = options;

  // Referencia al timestamp de la última actividad
  const lastActivityRef = useRef<number>(Date.now());
  
  // Referencia al timer de inactividad
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estado interno para saber si el usuario está activo
  const isActiveRef = useRef<boolean>(true);

  /**
   * Actualiza el timestamp de la última actividad
   */
  const updateActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    // Si estaba inactivo, ejecutar callback de activación
    if (!isActiveRef.current) {
      isActiveRef.current = true;
      onActive?.();
    }

    // Limpiar el timer anterior
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Configurar nuevo timer de inactividad
    inactivityTimerRef.current = setTimeout(() => {
      isActiveRef.current = false;
      onInactive?.();
    }, inactivityTimeout);
  }, [inactivityTimeout, onInactive, onActive]);

  /**
   * Obtiene el tiempo de inactividad actual en milisegundos
   */
  const getInactivityTime = useCallback(() => {
    return Date.now() - lastActivityRef.current;
  }, []);

  /**
   * Verifica si el usuario está activo actualmente
   */
  const isUserActive = useCallback(() => {
    return isActiveRef.current;
  }, []);

  useEffect(() => {
    // Lista de eventos que indican actividad del usuario
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Agregar listeners a todos los eventos
    events.forEach((event) => {
      document.addEventListener(event, updateActivity);
    });

    // Inicializar el timer de inactividad
    updateActivity();

    // Cleanup: remover listeners y limpiar timer
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [updateActivity]);

  return {
    /** Timestamp de la última actividad del usuario */
    lastActivity: lastActivityRef.current,
    /** Tiempo de inactividad actual en milisegundos */
    getInactivityTime,
    /** Indica si el usuario está activo actualmente */
    isUserActive,
    /** Fuerza una actualización de actividad manualmente */
    updateActivity,
  };
};

