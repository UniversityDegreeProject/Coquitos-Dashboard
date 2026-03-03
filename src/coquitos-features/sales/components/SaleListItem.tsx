// *Hooks
import { memo, useMemo } from "react";

// *Libraries
import { ShoppingCart } from "lucide-react";

// *Custom hooks
import { useTheme } from "@/shared/hooks/useTheme";

// *Components
import { SaleButtonsActions } from "./SaleButtonsActions";

// *Helpers
import {
  formatCurrency,
  getStatusColor,
  getPaymentMethodColor,
} from "../helpers";
import { formatDateTime } from "@/shared/helpers";

// *Interfaces
import type { SearchSalesParams, Sale } from "../interfaces";

// *Utils
import { cn } from "@/lib/utils";

interface SaleListItemProps {
  sale: Sale;
  currentParams: SearchSalesParams;
  onPageEmpty?: () => void;
}

/**
 * Item individual de venta en la lista
 * Diseño responsive con toda la información relevante
 */
export const SaleListItem = memo(
  ({ sale, currentParams, onPageEmpty }: SaleListItemProps) => {
    const { isDark } = useTheme();

    const formattedDate = useMemo(() => {
      if (!sale.createdAt) return "N/A";
      return formatDateTime(sale.createdAt);
    }, [sale.createdAt]);

    const customerName = useMemo(() => {
      if (!sale.customer) return "Cliente no disponible";
      return `${sale.customer.firstName} ${sale.customer.lastName}`;
    }, [sale.customer]);

    const userName = useMemo(() => {
      if (!sale.user) return "Usuario no disponible";
      return `${sale.user.firstName} ${sale.user.lastName}`;
    }, [sale.user]);

    return (
      <div
        className={cn(
          "rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200",
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:space-x-4">
          {/* Sección izquierda: Icon + Info principal */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark
                  ? "bg-gradient-to-r from-[#1E3A8A] to-[#F59E0B]"
                  : "bg-gradient-to-r from-[#275081] to-[#F9E44E]"
              }`}
            >
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`text-base sm:text-lg font-semibold mb-1 ${
                  isDark ? "text-[#F8FAFC]" : "text-gray-800"
                }`}
              >
                {sale.saleNumber}
              </h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <p
                  className={`${
                    isDark ? "text-[#94A3B8]" : "text-gray-600"
                  } truncate`}
                >
                  {customerName}
                </p>
              </div>
              {sale.customer?.email && (
                <p
                  className={`text-xs ${
                    isDark ? "text-[#64748B]" : "text-gray-500"
                  } truncate mt-1`}
                >
                  {sale.customer.email}
                </p>
              )}
              {sale.user && (
                <p
                  className={`text-xs ${
                    isDark ? "text-[#64748B]" : "text-gray-500"
                  } truncate mt-1`}
                >
                  Vendedor: {userName}
                </p>
              )}
              {/* Badges para móvil */}
              <div className="flex items-center gap-2 mt-2 sm:hidden">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    sale.status || "Pendiente"
                  )}`}
                >
                  {sale.status}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(
                    sale.paymentMethod
                  )}`}
                >
                  {sale.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Sección derecha: Desktop */}
          <div className="hidden sm:flex items-center gap-4 flex-shrink-0 self-center">
            {/* Badge de estado con label */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <p
                className={`text-xs mb-1 ${
                  isDark ? "text-[#64748B]" : "text-gray-400"
                }`}
              >
                Estado
              </p>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  sale.status || "Pendiente"
                )}`}
              >
                {sale.status}
              </span>
            </div>

            {/* Badge de método de pago con label */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <p
                className={`text-xs mb-1 ${
                  isDark ? "text-[#64748B]" : "text-gray-400"
                }`}
              >
                Método de pago
              </p>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(
                  sale.paymentMethod
                )}`}
              >
                {sale.paymentMethod}
              </span>
            </div>

            {/* Total */}
            <div className="flex-shrink-0 text-right min-w-[100px] flex flex-col items-center">
              <p
                className={`text-xs text-center ${
                  isDark ? "text-[#64748B]" : "text-gray-400"
                }`}
              >
                Total
              </p>
              <p
                className={`text-base font-bold text-center ${
                  isDark ? "text-[#F59E0B]" : "text-[#275081]"
                }`}
              >
                {formatCurrency(sale.total)}
              </p>
            </div>

            {/* Fecha */}
            <div className="flex-shrink-0 text-right min-w-[140px] flex flex-col items-center">
              <p
                className={`text-xs text-center ${
                  isDark ? "text-[#64748B]" : "text-gray-400"
                }`}
              >
                Fecha de creación
              </p>
              <p
                className={`text-sm text-center ${
                  isDark ? "text-[#94A3B8]" : "text-gray-500"
                }`}
              >
                {formattedDate}
              </p>
            </div>

            <SaleButtonsActions
              sale={sale}
              currentParams={currentParams}
              onPageEmpty={onPageEmpty}
            />
          </div>

          {/* Móvil */}
          <div className="flex sm:hidden items-center justify-between pt-2 border-t border-gray-200 dark:border-[#334155]">
            <div className="text-left">
              <p
                className={`text-xs ${
                  isDark ? "text-[#64748B]" : "text-gray-400"
                }`}
              >
                Total
              </p>
              <p
                className={`text-lg font-bold ${
                  isDark ? "text-[#F59E0B]" : "text-[#275081]"
                }`}
              >
                {formatCurrency(sale.total)}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-[#64748B]" : "text-gray-400"
                }`}
              >
                Fecha de creación
              </p>
              <p
                className={`text-xs ${
                  isDark ? "text-[#94A3B8]" : "text-gray-500"
                }`}
              >
                {formattedDate}
              </p>
            </div>
            <SaleButtonsActions
              sale={sale}
              currentParams={currentParams}
              onPageEmpty={onPageEmpty}
            />
          </div>
        </div>
      </div>
    );
  }
);
