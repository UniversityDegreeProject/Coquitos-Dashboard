import { memo } from "react";
import { ShoppingCart } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

/**
 * Componente de estado vacío para órdenes
 * Se muestra cuando no hay órdenes que cumplan con los filtros
 */
export const OrderEmptyState = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-12`}>
      <div className="text-center">
        <ShoppingCart className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
          No se encontraron órdenes
        </h3>
        <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Intenta ajustar los filtros o registra una nueva venta
        </p>
      </div>
    </div>
  );
});

