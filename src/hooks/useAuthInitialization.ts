import { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook que detecta cuando el estado de autenticación se está inicializando
 * desde el localStorage (Zustand persist)
 * 
 * @returns {boolean} true si está inicializando, false cuando ya terminó
 */
export const useAuthInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    // Esperar un tick para que Zustand rehidrate el estado
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Si ya no está inicializando pero el status es "authenticating", mantener el loader
  if (!isInitializing && status === 'authenticating') {
    return true;
  }

  return isInitializing;
};

