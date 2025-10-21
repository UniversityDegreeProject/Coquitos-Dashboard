/**
 * Componente de carga global que se muestra durante las transiciones
 * de autenticación y carga inicial de la aplicación
 */

interface GlobalLoaderProps {
  title : string 
  subtitle : string 
}
export const GlobalLoader = ({ subtitle, title }: GlobalLoaderProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#275081] to-[#2d5a8f]">
      {/* Contenedor del loader */}
      <div className="flex flex-col items-center space-y-6">
        {/* Logo animado */}
        <div className="relative">
          {/* Círculo exterior giratorio */}
          <div className="absolute inset-0 rounded-full border-4 border-[#F9E44E]/20 border-t-[#F9E44E] animate-spin w-24 h-24"></div>
          
          {/* Logo/Icono central */}
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F9E44E] to-[#F5F7E7] flex items-center justify-center shadow-2xl animate-pulse">
              <svg
                className="w-10 h-10 text-[#275081]"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-[#F5F7E7] animate-pulse">{subtitle}</p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-48 h-1 bg-[#F5F7E7]/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#F9E44E] to-[#F5F7E7] animate-[progress_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      {/* Animación de la barra de progreso */}
      <style>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

