import { memo } from "react";
import { Package } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

/**
 * Componente de estado vacío para cuando no hay batches registrados
 */
export const BatchEmptyState = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className={`text-center py-8 rounded-lg border-2 border-dashed ${isDark ? 'border-[#334155] bg-[#0F172A]/30' : 'border-gray-300 bg-gray-50'}`}>
      <Package className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
      <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
        Aún no hay batches registrados
      </p>
      <p className={`text-xs mt-1 ${isDark ? 'text-[#64748B]' : 'text-gray-500'}`}>
        Agrega un batch para empezar a registrar unidades
      </p>
    </div>
  );
});

BatchEmptyState.displayName = "BatchEmptyState";

