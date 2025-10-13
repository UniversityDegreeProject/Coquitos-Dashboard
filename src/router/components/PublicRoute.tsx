import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Componente para proteger rutas públicas (como login)
 * Solo permite acceso a usuarios NO autenticados
 */
export const PublicRoute = () => {
  const status = useAuthStore((state) => state.status);


  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado, permitir acceso a la ruta pública
  return <Outlet />;
};

