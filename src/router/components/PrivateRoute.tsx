import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Componente para proteger rutas privadas
 * Solo permite acceso a usuarios autenticados
 */
export const PrivateRoute = () => {
  const status = useAuthStore((state) => state.status);

  // Mientras verifica autenticación, mostrar loading
  if (status === 'authenticating') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#275081] via-[#2d5a8f] to-[#030405]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F9E44E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (status === 'not-authenticated') {
    return <Navigate to="/auth/login" replace />;
  }

  // Si está autenticado, permitir acceso
  return <Outlet />;
};

