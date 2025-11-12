import { memo } from "react";
import { Calculator } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * Componente de estado vacío para el historial de cierres
 */
export const CashRegisterHistoryEmptyState = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mb-4",
          isDark ? "bg-[#1E293B]" : "bg-gray-100"
        )}
      >
        <Calculator className={cn("w-10 h-10", isDark ? "text-gray-600" : "text-gray-400")} />
      </div>
      <h3 className={cn("text-lg font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>
        No hay cierres registrados
      </h3>
      <p className={cn("text-sm text-center max-w-md", isDark ? "text-gray-400" : "text-gray-600")}>
        Aún no se han realizado cierres de caja. Los cierres aparecerán aquí una vez que se completen.
      </p>
    </div>
  );
});

