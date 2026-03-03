import { memo, useMemo } from "react";
import {
  Banknote,
  Calculator,
  CheckCircle,
  Clock,
  ShoppingCart,
} from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import {
  formatCurrency,
  formatDifference,
} from "../../helpers/format-currency";
import {
  formatDateTime,
  calculateDuration,
} from "../../helpers/format-datetime";
import type { CashRegister } from "../../interfaces";
import { cn } from "@/lib/utils";

interface CashRegisterHistoryItemProps {
  cashRegister: CashRegister;
}

/**
 * Componente de item individual del historial de cierres
 * Muestra información completa de cada cierre de caja
 */
export const CashRegisterHistoryItem = memo(
  ({ cashRegister }: CashRegisterHistoryItemProps) => {
    const { isDark } = useTheme();

    // Formatear fechas
    const openedAtFormatted = useMemo(() => {
      if (!cashRegister.openedAt) return "N/A";
      return formatDateTime(cashRegister.openedAt);
    }, [cashRegister.openedAt]);

    const closedAtFormatted = useMemo(() => {
      if (!cashRegister.closedAt) return "N/A";
      return formatDateTime(cashRegister.closedAt);
    }, [cashRegister.closedAt]);

    // Calcular duración del turno
    const duration = useMemo(() => {
      if (!cashRegister.openedAt || !cashRegister.closedAt) return "N/A";
      return calculateDuration(cashRegister.openedAt, cashRegister.closedAt);
    }, [cashRegister.openedAt, cashRegister.closedAt]);

    // Formatear diferencia
    const differenceFormatted = useMemo(() => {
      if (cashRegister.difference === null)
        return { text: "N/A", color: "text-gray-500" };
      return formatDifference(cashRegister.difference);
    }, [cashRegister.difference]);

    // Nombre del usuario
    const userName = useMemo(() => {
      if (!cashRegister.user) return "Usuario no disponible";
      return `${cashRegister.user.firstName} ${cashRegister.user.lastName}`;
    }, [cashRegister.user]);

    return (
      <div
        className={cn(
          "rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-200",
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                isDark
                  ? "bg-gradient-to-r from-[#1E3A8A] to-[#F59E0B]"
                  : "bg-gradient-to-r from-[#275081] to-[#F9E44E]",
              )}
            >
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3
                className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Cierre de Caja
              </h3>
              <p
                className={cn(
                  "text-sm",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                {userName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs font-semibold text-green-600">
              Cerrado
            </span>
          </div>
        </div>

        {/* Información del turno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock
              className={cn(
                "w-4 h-4",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            />
            <div>
              <p
                className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500",
                )}
              >
                Turno iniciado
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {openedAtFormatted}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock
              className={cn(
                "w-4 h-4",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            />
            <div>
              <p
                className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500",
                )}
              >
                Turno cerrado
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {closedAtFormatted}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock
              className={cn(
                "w-4 h-4",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            />
            <div>
              <p
                className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500",
                )}
              >
                Duración
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {duration}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart
              className={cn(
                "w-4 h-4",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            />
            <div>
              <p
                className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500",
                )}
              >
                Órdenes procesadas
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {cashRegister.totalOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Resumen financiero */}
        <div
          className={cn(
            "rounded-lg p-4 mb-4",
            isDark ? "bg-[#0F172A]" : "bg-gray-50",
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className={cn(
                  "text-xs mb-1",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Monto Inicial
              </p>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(cashRegister.openingAmount)}
              </p>
            </div>
            <div>
              <p
                className={cn(
                  "text-xs mb-1",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Ventas Totales
              </p>
              <p className={cn("text-sm font-semibold text-green-600")}>
                {formatCurrency(cashRegister.totalSales)}
              </p>
            </div>
            <div>
              <p
                className={cn(
                  "text-xs mb-1",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Total Esperado
              </p>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {cashRegister.expectedAmount
                  ? formatCurrency(cashRegister.expectedAmount)
                  : "N/A"}
              </p>
            </div>
            <div>
              <p
                className={cn(
                  "text-xs mb-1",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Monto Cerrado
              </p>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {cashRegister.closingAmount
                  ? formatCurrency(cashRegister.closingAmount)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Diferencia destacada */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#334155]">
          <div>
            <p
              className={cn(
                "text-xs mb-1",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              Diferencia
            </p>
            <p className={cn("text-lg font-bold", differenceFormatted.color)}>
              {differenceFormatted.text}
            </p>
            <p
              className={cn(
                "text-xs mt-1",
                isDark ? "text-gray-500" : "text-gray-500",
              )}
            >
              {cashRegister.difference === 0
                ? "Cuadre perfecto ✓"
                : cashRegister.difference && cashRegister.difference > 0
                  ? "Sobrante"
                  : cashRegister.difference && cashRegister.difference < 0
                    ? "Faltante"
                    : ""}
            </p>
          </div>
          <Banknote
            className={cn(
              "w-8 h-8",
              cashRegister.difference === 0
                ? "text-green-500"
                : cashRegister.difference && cashRegister.difference > 0
                  ? "text-green-500"
                  : "text-red-500",
            )}
          />
        </div>

        {/* Notas si existen */}
        {cashRegister.notes && (
          <div
            className={cn(
              "mt-4 pt-4 border-t",
              isDark ? "border-[#334155]" : "border-gray-200",
            )}
          >
            <p
              className={cn(
                "text-xs mb-1",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              Notas
            </p>
            <p
              className={cn(
                "text-sm",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              {cashRegister.notes}
            </p>
          </div>
        )}
      </div>
    );
  },
);
