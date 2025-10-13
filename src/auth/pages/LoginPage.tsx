import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

import { User, ArrowRight, Beef, StoreIcon } from 'lucide-react';

import AnimatedWelcome from '@/auth/pages/AnimatedWelcome';
import { useAuthStore } from '../store/auth.store';
import { loginUserSchema } from '../schemas/login-user.schema';
import type { UserLoginFormData } from '../interface';
import { paths } from '@/router/paths';
import { LabelInputString, LabelPasswordInput } from '@/shared/components';

export default function LoginPage() {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const clearError = useAuthStore((state) => state.clearError);

  const {control,handleSubmit,formState: { errors } } = useForm<UserLoginFormData>({
    resolver: zodResolver(loginUserSchema),
  });

  // Limpiar error al desmontar el componente
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Navegar cuando el usuario esté autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      navigate(paths.dashboard.root);
    }
  }, [status, navigate]);

  const onSubmit = async (data: UserLoginFormData) => {
    // Limpiar errores previos antes de intentar login
    clearError();
    await login(data);
  };



  return (
    <div className="h-screen bg-gradient-to-br from-[#275081] via-[#2d5a8f] to-[#030405] flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-[#F9E44E] rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-[#F9E44E] rounded-full opacity-10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full h-full max-w-6xl grid lg:grid-cols-2 gap-4 lg:gap-8 items-center relative z-10">
        <div className="hidden lg:flex flex-col justify-center items-center animate-fade-in">
          <AnimatedWelcome />

          <div className="mt-4 lg:mt-6 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-3 leading-tight">
              Embutidos Coquito
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <StoreIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#F9E44E]" />
              <p className="text-lg xl:text-xl text-[#F5F7E7] font-light">
                Dashboard Administrativo
              </p>
              <StoreIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#F9E44E]" />
            </div>
            
          </div>
        </div>

        <div className="w-full max-w-md mx-auto animate-scale-in flex flex-col justify-center" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-7 lg:p-8 border border-white/20">
            <div className="flex items-center justify-center mb-5 lg:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#F9E44E] rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#275081] to-[#2d5a8f] p-3 rounded-2xl">
                  <Beef className="w-8 h-8 text-[#F9E44E]" />
                </div>
              </div>
            </div>

            <div className="text-center mb-5 lg:mb-6 lg:hidden">
              <h2 className="text-2xl font-bold text-[#275081] mb-1">
                Embutidos Coquito
              </h2>
              <p className="text-sm text-gray-600">Dashboard Administrativo</p>
            </div>

            <div className="text-center mb-5 lg:mb-6 hidden lg:block">
              <h2 className="text-xl xl:text-2xl font-bold text-[#275081] mb-2">
                Bienvenido de nuevo
              </h2>
              <p className="text-sm text-gray-600">Inicia sesión para continuar</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-5">
              <LabelInputString
                label="Usuario"
                name="username"
                control={control}
                error={errors.username?.message}
                placeholder="Ejemplo: IIJesusII"
                icon={User}
                disabled={status === 'authenticating'}
                required
              />

              <LabelPasswordInput
                label="Contraseña"
                name="password"
                control={control}
                error={errors.password?.message}
                placeholder="••••••••"
                disabled={status === 'authenticating'}
                required
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={status === 'authenticating'}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-gradient-to-r from-[#275081] to-[#2d5a8f] hover:from-[#2d5a8f] hover:to-[#275081] text-white font-semibold py-3 lg:py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10">
                  {status === 'authenticating' ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </span>
                {status !== 'authenticating' && (
                  <ArrowRight
                    className={`w-5 h-5 transition-transform duration-300 relative z-10 ${
                      isHovered ? 'translate-x-1' : ''
                    }`}
                  />
                )}
                <div className="absolute inset-0 bg-[#F9E44E] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-10"></div>
              </button>
            </form>

            <div className="mt-5 lg:mt-6 pt-5 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-xs sm:text-sm">
                ¿Necesitas ayuda?{' '}
                <a href="#" className="text-[#275081] hover:text-[#2d5a8f] font-medium transition-colors hover:underline">
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>

          <div className="mt-3 lg:mt-4 text-center">
            <p className="text-[#F5F7E7]/60 text-xs">
              © 2025 Embutidos Coquito. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}