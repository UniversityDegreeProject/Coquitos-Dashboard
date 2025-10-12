import { Navigate } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Componente para redirigir la raíz según el estado de autenticación
 */
export const RootRedirect = () => {
  const status = useAuthStore((state) => state.status);

  // Si está autenticado, ir al dashboard
  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado, ir al login
  return <Navigate to="/auth/login" replace />;
};

