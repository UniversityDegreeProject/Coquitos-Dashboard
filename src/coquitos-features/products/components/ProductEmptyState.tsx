import { memo } from "react";
import { Package } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

/**
 * Componente de estado vacío para productos
 * Se muestra cuando no hay productos que coincidan con los filtros
 */
export const ProductEmptyState = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-12`}>
      <div className="text-center">
        <Package className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
          No se encontraron productos
        </h3>
        <p className={`text-base ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Intenta ajustar los filtros o agrega nuevos productos
        </p>
      </div>
    </div>
  );
});

