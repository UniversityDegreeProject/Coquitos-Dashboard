import { Navigate } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';


export const RootRedirect = () => {
  const status = useAuthStore((state) => state.status);


  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }


  return <Navigate to="/auth/login" replace />;
};

