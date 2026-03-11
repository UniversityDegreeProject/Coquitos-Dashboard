import { useEffect, useRef, useCallback } from 'react';

interface UseUserActivityOptions {

  inactivityTimeout?: number;
  onInactive?: () => void;
  onActive?: () => void;
}

/**
 * Hook para detectar actividad e inactividad del usuario
 * Escucha eventos de mouse, teclado y touch para determinar si el usuario está activo
 * ✅ Optimizado con throttle de 1s para evitar ejecuciones excesivas
 */
export const useUserActivity = (options: UseUserActivityOptions = {}) => {
  const { inactivityTimeout = 5 * 60 * 1000, onInactive, onActive } = options;

  // Referencia al timestamp de la última actividad
  const lastActivityRef = useRef<number>(Date.now());
  
  // Referencia al timer de inactividad
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Estado interno para saber si el usuario está activo
  const isActiveRef = useRef<boolean>(true);

  // Throttle: evitar ejecutar updateActivity más de 1 vez por segundo
  const lastThrottleRef = useRef<number>(0);

  /**
   * Actualiza el timestamp de la última actividad
   * ✅ Con throttle de 1s para evitar cientos de ejecuciones por segundo
   */
  const updateActivity = useCallback(() => {
    const now = Date.now();

    // Throttle: ignorar si no pasó al menos 1 segundo desde la última ejecución
    if (now - lastThrottleRef.current < 1000) return;
    lastThrottleRef.current = now;

    lastActivityRef.current = now;

    // Si estaba inactivo, ejecutar callback de activación
    if (!isActiveRef.current) {
      isActiveRef.current = true;
      console.log('✅ Usuario reactivado después de inactividad');
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
    // ✅ Solo los eventos esenciales (6 en vez de 11)
    const events = [
      'mousedown',    // Click detecta actividad mejor que mousemove
      'keydown',      // Detecta presionar cualquier tecla
      'input',        // Detecta cambios en inputs (formularios)
      'scroll',       // Detecta scroll
      'touchstart',   // Detecta toque en pantallas táctiles
      'click',        // Detecta clicks
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

