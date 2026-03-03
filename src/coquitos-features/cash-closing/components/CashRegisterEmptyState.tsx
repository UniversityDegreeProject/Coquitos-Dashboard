import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";

/**
 * Componente de estado vacío para caja cerrada
 * Se muestra cuando no hay una caja abierta actualmente
 */
export const CashRegisterEmptyState = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-gradient-to-br from-red-900/20 via-[#1E293B] to-red-900/20 border-red-500/30' : 'bg-gradient-to-br from-red-50 via-white to-red-50 border-red-200'} rounded-2xl p-6 shadow-md border`}>
      <div className="text-center py-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-sm">Caja Cerrada</span>
        </div>
        <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No hay una caja abierta actualmente
        </p>
      </div>
    </div>
  );
});

