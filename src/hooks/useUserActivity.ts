import { useEffect, useRef, useCallback } from 'react';

interface UseUserActivityOptions {

  inactivityTimeout?: number;
  onInactive?: () => void;
  onActive?: () => void;
}

/**
 * Hook para detectar actividad e inactividad del usuario
 * Escucha eventos de mouse, teclado y touch para determinar si el usuario está activo
 */
export const useUserActivity = (options: UseUserActivityOptions = {}) => {
  const { inactivityTimeout = 5 * 60 * 1000, onInactive, onActive } = options;

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

    // 🔍 LOG TEMPORAL: Ver cuando se detecta actividad
    console.log('🟢 Actividad detectada:', new Date().toLocaleTimeString());

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
      console.log('⚠️ Usuario marcado como INACTIVO después de', inactivityTimeout / 60000, 'minutos');
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
      'keydown',      // ← Detecta presionar cualquier tecla (reemplaza keypress)
      'keyup',        // ← Detecta soltar teclas
      'input',        // ← Detecta cambios en inputs (CRÍTICO para formularios)
      'change',       // ← Detecta cambios en selects, checkboxes, etc.
      'scroll',
      'touchstart',
      'touchmove',    // ← Detecta movimiento en pantallas táctiles
      'click',
      'focus',        // ← Detecta cuando haces focus en un campo
      'blur',         // ← Detecta cuando sales de un campo
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

