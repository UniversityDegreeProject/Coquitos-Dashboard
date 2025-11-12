import { useShallow } from "zustand/shallow";
import { Calculator, AlertTriangle } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuthStore } from "@/auth/store/auth.store";
import { useGetCurrentCashRegister } from "../hooks";
import { useCashRegisterStore } from "../store/cash-register.store";
import {
  CashRegisterCurrentStatus,
  DailySalesSummary,
  FormOpenCashModal,
  FormCloseCashModal,
  CloseCashAction,
  OpenCashAction,
} from "../components";
import { CashRegisterHistoryList } from "../components/history";
import { GenericGridLoader } from "@/shared/components";

/**
 * Página principal de Cierre de Caja
 * Permite abrir caja, ver resumen del día y cerrar caja
 */
export const CashClosePage = () => {
  // * Zustand
  const user = useAuthStore(useShallow((state) => state.user));
  const isOpenCashModalOpen = useCashRegisterStore(useShallow((state) => state.isOpenCashModalOpen));
  const isCloseCashModalOpen = useCashRegisterStore(useShallow((state) => state.isCloseCashModalOpen));
  
  // * Theme
  const { colors, isDark } = useTheme();

  // * TanStack Query - Obtener caja actual del usuario
  const { cashRegister, isLoading } = useGetCurrentCashRegister(user?.id);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
              <Calculator className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
            <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold ${colors.text.primary}`}>
              Cierre de Caja
            </h3>
          </div>
        </div>
        
        {/* Advertencia */}
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-700'} ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'} px-4 py-2 rounded-xl border ${isDark ? 'border-yellow-500/30' : 'border-yellow-200'}`}>
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">Asegúrate de completar todas las órdenes antes del cierre</span>
        </div>
      </div>

      {/* Estado Actual de la Caja */}
      {isLoading ? (
        <GenericGridLoader title="Cargando información de caja..." />
      ) : (
        <CashRegisterCurrentStatus cashRegister={cashRegister} />
      )}

      {/* Resumen de Ventas del Día */}
      {cashRegister && cashRegister.status === "Abierto" && (
        <DailySalesSummary cashRegister={cashRegister} />
      )}

      {/* Botón de Acción (Abrir o Cerrar) */}
      {
        !cashRegister || cashRegister.status === "Cerrado" ? <OpenCashAction /> : <CloseCashAction />
      }

      {/* Historial de Cierres */}
      <CashRegisterHistoryList />

      {/* Modales */}
      {isOpenCashModalOpen && <FormOpenCashModal />}
      {isCloseCashModalOpen && cashRegister && <FormCloseCashModal cashRegister={cashRegister} />}
    </div>
  );
};
