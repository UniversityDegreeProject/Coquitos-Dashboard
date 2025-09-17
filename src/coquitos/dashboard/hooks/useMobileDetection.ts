import { useState, useEffect, useCallback } from 'react';

/**
 * Hook optimizado para detectar si estamos en vista móvil
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Inicializar con el valor correcto si window está disponible
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const checkIsMobile = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(prev => prev !== mobile ? mobile : prev); // Solo actualizar si cambió
  }, []);

  useEffect(() => {
    // Throttle para resize events para mejor rendimiento
    let timeoutId: NodeJS.Timeout;
    
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 100);
    };

    window.addEventListener('resize', throttledResize, { passive: true });

    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, [checkIsMobile]);

  return isMobile;
};
