import { memo } from "react";
import { Users } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

/**
 * Componente reutilizable para mostrar estado vacío
 * Se muestra cuando no hay usuarios que cumplan con los filtros
 */
export const UserEmptyState = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-12`}>
      <div className="text-center">
        <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
          No se encontraron usuarios
        </h3>
        <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Intenta ajustar los filtros o crea un nuevo usuario
        </p>
      </div>
    </div>
  );
});

