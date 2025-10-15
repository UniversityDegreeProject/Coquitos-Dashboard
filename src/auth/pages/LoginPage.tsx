import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

import { User, ArrowRight, StoreIcon } from 'lucide-react';

import AnimatedWelcome from '@/auth/pages/AnimatedWelcome';
import { useAuthStore } from '../store/auth.store';
import { loginUserSchema } from '../schemas/login-user.schema';
import type { UserLoginFormData } from '../interface';
import { paths } from '@/router/paths';
import { LabelInputString, LabelPasswordInput } from '@/shared/components';
import SplashCursor from '@/components/SplashCursor';

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
    <div className="h-screen bg-gradient-to-br from-[#F0F8FF] via-[#E6F3FF] to-[#D6EBFF] flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Elementos decorativos japoneses */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos de luz azul suaves */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-[#87CEEB]/20 to-[#4682B4]/15 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#B0E0E6]/25 to-[#87CEEB]/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-[#E0F6FF]/15 to-[#B0E0E6]/10 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Partículas flotantes sutiles - colores más oscuros */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#2F4F4F]/60 rounded-full animate-float-particle"></div>
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-[#4682B4]/70 rounded-full animate-float-particle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-40 w-2.5 h-2.5 bg-[#5F9EA0]/80 rounded-full animate-float-particle" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-[#708090]/90 rounded-full animate-float-particle" style={{ animationDelay: '1s' }}></div>
        
        {/* Ondas de energía sutiles - comienzan fuera de la esfera */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border border-[#87CEEB]/15 rounded-full animate-pulse-wave" style={{ animationDuration: '8s' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border border-[#4682B4]/18 rounded-full animate-pulse-wave" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="w-full h-full max-w-6xl grid lg:grid-cols-2 gap-4 lg:gap-8 items-center relative z-10">
        <div className="hidden lg:flex flex-col justify-center items-center animate-fade-in">
          <AnimatedWelcome />

          <div className="mt-6 lg:mt-8 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold bg-gradient-to-r from-[#4682B4] via-[#5F9EA0] to-[#87CEEB] bg-clip-text text-transparent mb-4 leading-tight animate-text-glow">
              Embutidos Coquito
            </h1>
              {/* Efecto de brillo detrás del texto */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#87CEEB]/20 to-[#4682B4]/20 blur-xl animate-pulse-slow"></div>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-[#87CEEB] to-[#4682B4] rounded-full flex items-center justify-center animate-bounce-subtle">
                <StoreIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#2F4F4F]" />
              </div>
              <p className="text-xl xl:text-2xl text-[#2F4F4F] font-medium animate-fade-in-delay">
                Dashboard Administrativo
              </p>
              <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-[#87CEEB] to-[#4682B4] rounded-full flex items-center justify-center animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
                <StoreIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#2F4F4F]" />
              </div>
            </div>
            
            {/* Texto descriptivo elegante */}
            <div className="max-w-md mx-auto">
              <p className="text-[#2F4F4F]/80 text-lg font-light leading-relaxed animate-fade-in-delay" style={{ animationDelay: '0.8s' }}>
                "La calidad que distingue, el sabor que perdura"
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto animate-scale-in flex flex-col justify-center" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/98 backdrop-blur-md rounded-3xl lg:rounded-[2rem] shadow-2xl p-6 sm:p-7 lg:p-8 border border-white/30 relative overflow-hidden">
            {/* Efecto de brillo sutil en el fondo del formulario */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#87CEEB]/5 to-[#4682B4]/5 rounded-3xl lg:rounded-[2rem]"></div>
            
            <div className="relative z-10 flex items-center justify-center mb-6 lg:mb-8">
              <div className="relative group">
                {/* Círculos de energía concéntricos */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#87CEEB]/30 to-[#4682B4]/20 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse-slow"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-[#B0E0E6]/40 to-[#87CEEB]/30 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                
                {/* Icono principal con efecto de brillo */}
                <div className="relative bg-gradient-to-br from-[#4682B4] via-[#5F9EA0] to-[#87CEEB] p-2 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
                  <img 
                    src="/imagen-corporativa.svg" 
                    alt="Embutidos Coquito" 
                    className="w-16 h-16 drop-shadow-lg object-contain filter brightness-110 contrast-110"
                  />
                </div>
                
                {/* Partículas flotantes alrededor del icono - colores más oscuros */}
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#2F4F4F]/70 rounded-full animate-float-particle"></div>
                <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-[#4682B4]/80 rounded-full animate-float-particle" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-1/2 -left-4 w-1 h-1 bg-[#708090]/90 rounded-full animate-float-particle" style={{ animationDelay: '3s' }}></div>
              </div>
            </div>

            <div className="relative z-10 text-center mb-6 lg:mb-8 lg:hidden">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4682B4] to-[#87CEEB] bg-clip-text text-transparent mb-2 animate-text-glow">
                Embutidos Coquito
              </h2>
              <p className="text-[#2F4F4F]/70 text-base font-medium">Dashboard Administrativo</p>
            </div>

            <div className="relative z-10 text-center mb-6 lg:mb-8 hidden lg:block">
              <h2 className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-[#4682B4] to-[#87CEEB] bg-clip-text text-transparent mb-3 animate-text-glow">
                Bienvenido de nuevo
              </h2>
              <p className="text-[#2F4F4F]/70 text-base font-medium">Inicia sesión para continuar</p>
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
                className="relative w-full bg-gradient-to-r from-[#4682B4] via-[#5F9EA0] to-[#87CEEB] hover:from-[#87CEEB] hover:via-[#5F9EA0] hover:to-[#4682B4] text-white font-bold py-4 lg:py-4 rounded-2xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl flex items-center justify-center gap-3 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#87CEEB]/20 to-[#4682B4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Partículas de energía en hover - colores más oscuros */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-2 left-4 w-1 h-1 bg-[#2F4F4F] rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute bottom-2 right-4 w-1 h-1 bg-[#4682B4] rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute top-1/2 left-2 w-0.5 h-0.5 bg-[#708090] rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                <span className="relative z-10 text-lg">
                  {status === 'authenticating' ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </span>
                {status !== 'authenticating' && (
                  <ArrowRight
                    className={`w-6 h-6 transition-all duration-500 relative z-10 ${
                      isHovered ? 'translate-x-2 scale-110' : ''
                    }`}
                  />
                )}
                
                {/* Efecto de onda expansiva en click */}
                <div className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-200 rounded-2xl"></div>
              </button>
            </form>

            <div className="relative z-10 mt-6 lg:mt-8 pt-6 border-t border-[#4682B4]/20 text-center">
              <p className="text-[#2F4F4F]/70 text-sm">
                ¿Necesitas ayuda?{' '}
                <a href="#" className="text-[#4682B4] hover:text-[#87CEEB] font-semibold transition-all duration-300 hover:underline hover:scale-105 inline-block">
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>

          <div className="mt-4 lg:mt-6 text-center">
            <p className="text-[#2F4F4F]/60 text-xs font-medium">
              © 2025 Pollos Coquito. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
      
      {/* SlashCursor personalizado para el login */}
      <SplashCursor />
    </div>
  );
}