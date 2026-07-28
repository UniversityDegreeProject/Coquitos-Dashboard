import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

import { User, ArrowRight, StoreIcon } from "lucide-react";

import AnimatedWelcome from "@/auth/pages/AnimatedWelcome";
import { useAuthStore } from "../store/auth.store";
import { loginUserSchema } from "../schemas/login-user.schema";
import type { AuthLoginFormData } from "../interface";
import { paths } from "@/router/paths";
import { LabelInputString, LabelPasswordInput } from "@/shared/components";

import { toast } from "sonner";

export const LoginPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLoginFormData>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit: SubmitHandler<AuthLoginFormData> = async (data) => {
    clearError();
    const isSuccesLogged = await login(data);
    if (isSuccesLogged) {
      const user = useAuthStore.getState().user;
      toast.success(`¡Bienvenido, ${user?.firstName}!`);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      navigate(paths.dashboard.root);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] via-[#E6F3FF] to-[#D6EBFF] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-[#87CEEB]/20 to-[#4682B4]/15 rounded-full blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#B0E0E6]/25 to-[#87CEEB]/20 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-[#E0F6FF]/15 to-[#B0E0E6]/10 rounded-full blur-2xl animate-float-slow"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-full h-full border border-[#87CEEB]/15 rounded-full animate-pulse-wave"
            style={{ animationDuration: "8s" }}
          />
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center relative z-10">
        {/* Branding: flex por defecto, se oculta solo bajo md (evita bug hidden+breakpoint) */}
        <div className="flex max-md:hidden flex-col justify-center items-center">
          <AnimatedWelcome />

          <div className="mt-6 md:mt-8 text-center">
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-[#4682B4] mb-4 leading-tight">
              Embutidos Coquito
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-[#87CEEB] to-[#4682B4] rounded-full flex items-center justify-center">
                <StoreIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#2F4F4F]" />
              </div>
              <p className="text-xl xl:text-2xl text-[#2F4F4F] font-medium">
                Dashboard Administrativo
              </p>
              <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-[#87CEEB] to-[#4682B4] rounded-full flex items-center justify-center">
                <StoreIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#2F4F4F]" />
              </div>
            </div>

            <p className="text-[#2F4F4F]/80 text-lg font-light leading-relaxed max-w-md mx-auto">
              &ldquo;La calidad que distingue, el sabor que perdura&rdquo;
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full max-w-md mx-auto flex flex-col justify-center md:col-start-2">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/30 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#87CEEB]/5 to-[#4682B4]/5 rounded-3xl pointer-events-none"
              aria-hidden
            />

            <div className="relative z-10 flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-[#4682B4] via-[#5F9EA0] to-[#87CEEB] p-2 rounded-2xl shadow-sm flex items-center justify-center">
                <img
                  src="/imagen-corporativa.svg"
                  alt="Embutidos Coquito"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>

            {/* Título siempre visible — sin toggles hidden/breakpoint */}
            <div className="relative z-10 text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#4682B4] mb-2">
                Bienvenido de nuevo
              </h2>
              <p className="text-[#2F4F4F]/70 text-base font-medium">
                Inicia sesión en Embutidos Coquito
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative z-10 space-y-4 sm:space-y-5"
            >
              <LabelInputString
                label="Usuario"
                name="username"
                control={control}
                error={errors.username?.message}
                placeholder="Ejemplo: IIJesusII"
                icon={User}
                disabled={status === "authenticating"}
                required
                autoComplete="username"
              />

              <LabelPasswordInput
                label="Contraseña"
                name="password"
                control={control}
                error={errors.password?.message}
                placeholder="••••••••"
                disabled={status === "authenticating"}
                required
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={status === "authenticating"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full bg-gradient-to-r from-[#4682B4] via-[#5F9EA0] to-[#87CEEB] hover:from-[#87CEEB] hover:via-[#5F9EA0] hover:to-[#4682B4] text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 text-lg">
                  {status === "authenticating"
                    ? "Iniciando sesión..."
                    : "Iniciar Sesión"}
                </span>
                {status !== "authenticating" ? (
                  <ArrowRight
                    className={`w-6 h-6 relative z-10 transition-transform duration-300 ${
                      isHovered ? "translate-x-1" : ""
                    }`}
                  />
                ) : null}
              </button>
            </form>

            <div className="relative z-10 mt-6 pt-6 border-t border-[#4682B4]/20 text-center">
              <p className="text-[#2F4F4F]/70 text-sm">
                ¿Necesitas ayuda?{" "}
                <a
                  href="#"
                  className="text-[#4682B4] hover:text-[#5F9EA0] font-semibold transition-colors duration-200 hover:underline"
                >
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[#2F4F4F]/60 text-xs font-medium">
              © 2025 Embutidos Coquito. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
