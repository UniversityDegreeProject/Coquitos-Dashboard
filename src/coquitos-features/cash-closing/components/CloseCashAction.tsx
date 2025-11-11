import { memo, useCallback } from "react";
import { Calculator } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useShallow } from "zustand/shallow";
import { useCashRegisterStore } from "../store/cash-register.store";

/**
 * Componente que muestra el botón para CERRAR la caja
 * Se muestra cuando HAY caja abierta
 */
export const CloseCashAction = memo(() => {
  const { isDark } = useTheme();
  const openCloseCashModal = useCashRegisterStore(useShallow((state) => state.openCloseCashModal));

  const handleCloseCash = useCallback(() => {
    openCloseCashModal();
  }, [openCloseCashModal]);

  return (
    <div className={`${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-xl border-2`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ¿Listo para cerrar la caja?
          </h3>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Esta acción generará el reporte final y cerrará las operaciones del día.
          </p>
        </div>
        <button
          onClick={handleCloseCash}
          className={`flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${isDark ? 'from-red-700 to-red-500' : 'from-red-600 to-red-500'} text-white rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-200 font-bold shadow-lg`}
        >
          <Calculator className="w-5 h-5" />
          Realizar Cierre de Caja
        </button>
      </div>
    </div>
  );
});

