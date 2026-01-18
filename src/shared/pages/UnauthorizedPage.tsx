import { useState, useEffect } from "react";
import { Lock, Shield, ArrowLeft, Home, Mail } from "lucide-react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export const UnauthorizedUser = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setIsVisible(true);

    // Generar partículas flotantes
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 2,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #F5F7E7 0%, #E8EBD8 50%, #F5F7E7 100%)",
      }}
    >
      {/* Partículas flotantes animadas */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            left: `${particle.left}%`,
            bottom: "-10%",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: "#99AEBF",
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Grid de fondo */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(153, 174, 191, 0.3) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(153, 174, 191, 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Contenedor principal */}
      <div
        className={`relative max-w-md w-full transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Card con efecto suave */}
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(153, 174, 191, 0.2)" }}
        >
          {/* Efecto de borde superior */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, #99AEBF, transparent)",
            }}
          ></div>

          {/* Icono principal animado */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
                style={{ backgroundColor: "#99AEBF" }}
              ></div>
              <div
                className="relative rounded-full p-6 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #99AEBF 0%, #7A95AA 100%)",
                }}
              >
                <Shield
                  className="w-16 h-16 text-white animate-bounce"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <div
                className="absolute bottom-0 right-0 rounded-full p-1.5 shadow-lg"
                style={{ backgroundColor: "#D4A574" }}
              >
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1
            className="text-4xl font-bold text-center mb-3 tracking-tight"
            style={{ color: "#4A5C6A" }}
          >
            Acceso Denegado
          </h1>

          {/* Subtítulo */}
          <p
            className="text-center mb-8 text-lg leading-relaxed"
            style={{ color: "#7A8A99" }}
          >
            No tienes los permisos necesarios para acceder a esta sección
          </p>

          {/* Mensaje informativo */}
          <div
            className="rounded-2xl p-4 mb-8"
            style={{ backgroundColor: "#F5F7E7", border: "1px solid #D9DCC9" }}
          >
            <p
              className="text-sm text-center leading-relaxed"
              style={{ color: "#5A6C7A" }}
            >
              Si crees que esto es un error, contacta con el administrador o
              verifica que tu cuenta tenga los permisos adecuados.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 group"
              style={{
                background: "linear-gradient(135deg, #99AEBF 0%, #7A95AA 100%)",
              }}
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Volver Atrás
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 group"
              style={{
                backgroundColor: "#F5F7E7",
                color: "#4A5C6A",
                border: "2px solid #D9DCC9",
              }}
            >
              <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
              Ir al Inicio
            </button>

            <button
              onClick={() =>
                (window.location.href = "mailto:support@example.com")
              }
              className="w-full font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              style={{ color: "#7A95AA" }}
            >
              <Mail className="w-4 h-4" />
              Contactar Soporte
            </button>
          </div>
        </div>

        {/* Código de error decorativo */}
        <div className="text-center mt-6">
          <p
            className="text-sm font-mono opacity-50"
            style={{ color: "#99AEBF" }}
          >
            ERROR 403 - FORBIDDEN
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          50% {
            transform: translateY(-100vh) rotate(180deg);
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};
