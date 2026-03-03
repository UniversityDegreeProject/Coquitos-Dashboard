import { memo, useCallback } from "react";
import { Unlock } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useShallow } from "zustand/shallow";
import { useCashRegisterStore } from "../store/cash-register.store";

/**
 * Componente que muestra el botón para ABRIR la caja
 * Se muestra cuando NO hay caja abierta
 */
export const OpenCashAction = memo(() => {
  const { isDark } = useTheme();
  const openOpenCashModal = useCashRegisterStore(useShallow((state) => state.openOpenCashModal));

  const handleOpenCash = useCallback(() => {
    openOpenCashModal();
  }, [openOpenCashModal]);

  return (
    <div className={`${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-md border`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ¿Listo para iniciar el turno?
          </h3>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Abre la caja para comenzar a registrar ventas del día
          </p>
        </div>
        <button
          onClick={handleOpenCash}
          className={`flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${isDark ? 'from-emerald-600 to-green-500' : 'from-emerald-500 to-green-600'} text-white rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-200 font-bold shadow-sm`}
        >
          <Unlock className="w-5 h-5" />
          Abrir Caja
        </button>
      </div>
    </div>
  );
});

