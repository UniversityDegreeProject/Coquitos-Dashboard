// * Librerías
import { memo } from "react";
import { Loader2 } from "lucide-react";

// * Hooks
import { useTheme } from "@/shared/hooks/useTheme";

interface GenericGridLoaderProps {
  /** El título principal del loader (ej: "Cargando Productos") */
  title: string;
  /** El mensaje secundario (opcional) */
  message?: string;
  /** Clase de altura mínima (ej: 'min-h-[200px]') */
  minHeightClass?: string;
}

/**
 * Componente genérico que muestra un loader centrado y estilizado.
 * Se usa en cualquier grilla o contenedor que espera datos.
 */
export const GenericGridLoader = memo(({
  title,
  message = "Por favor, espere un momento...",
  minHeightClass = "min-h-[350px]", // Default
}: GenericGridLoaderProps) => {
  const { isDark, colors } = useTheme();

  return (
    <div
      className={`
        w-full flex items-center justify-center
        rounded-xl shadow-sm border
        ${isDark ? 'bg-[#1E293B]/50 border-[#334155]/50' : 'bg-white/50 border-white/50'}
        transition-all duration-300
        ${minHeightClass} 
      `}
      aria-label={title}
      role="status"
    >
      <div className="flex flex-col items-center gap-4 text-center p-4">
        
        {/* Icono Giratorio */}
        <Loader2
          className={`
            w-12 h-12 animate-spin 
            ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}
          `}
          aria-hidden="true"
        />
        
        {/* Texto Dinámico */}
        <div className="space-y-1">
          <h3 className={`text-xl font-bold ${colors.text.primary}`}>
            {title}
          </h3>
          <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
            {message}
          </p>
        </div>

      </div>
    </div>
  );
});

GenericGridLoader.displayName = "GenericGridLoader";