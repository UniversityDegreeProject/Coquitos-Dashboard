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
 * Diseño responsive con toda la información relevante siempre visible
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
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100",
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Info principal */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark
                  ? "bg-gradient-to-r from-[#1E3A8A] to-[#F59E0B]"
                  : "bg-gradient-to-r from-[#275081] to-[#F9E44E]"
              }`}
            >
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "text-base sm:text-lg font-semibold mb-1 truncate",
                  isDark ? "text-[#F8FAFC]" : "text-gray-800",
                )}
              >
                {sale.saleNumber}
              </h3>
              <p
                className={cn(
                  "text-xs sm:text-sm truncate",
                  isDark ? "text-[#94A3B8]" : "text-gray-600",
                )}
              >
                {customerName}
              </p>
              {sale.customer?.email ? (
                <p
                  className={cn(
                    "text-xs truncate mt-1",
                    isDark ? "text-[#64748B]" : "text-gray-500",
                  )}
                >
                  {sale.customer.email}
                </p>
              ) : null}
              {sale.user ? (
                <p
                  className={cn(
                    "text-xs truncate mt-1",
                    isDark ? "text-[#64748B]" : "text-gray-500",
                  )}
                >
                  Vendedor: {userName}
                </p>
              ) : null}
            </div>
          </div>

          {/* Meta + acciones: siempre visibles */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:flex-nowrap lg:flex-shrink-0">
            <div className="flex flex-col items-start sm:items-center">
              <p
                className={`text-xs mb-1 ${isDark ? "text-[#64748B]" : "text-gray-400"}`}
              >
                Estado
              </p>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  sale.status || "Pendiente",
                )}`}
              >
                {sale.status}
              </span>
            </div>

            <div className="flex flex-col items-start sm:items-center">
              <p
                className={`text-xs mb-1 ${isDark ? "text-[#64748B]" : "text-gray-400"}`}
              >
                Método de pago
              </p>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(
                  sale.paymentMethod,
                )}`}
              >
                {sale.paymentMethod}
              </span>
            </div>

            <div className="min-w-[90px]">
              <p
                className={`text-xs ${isDark ? "text-[#64748B]" : "text-gray-400"}`}
              >
                Total
              </p>
              <p
                className={`text-base font-bold ${
                  isDark ? "text-[#F59E0B]" : "text-[#275081]"
                }`}
              >
                {formatCurrency(sale.total)}
              </p>
            </div>

            <div className="min-w-[120px]">
              <p
                className={`text-xs ${isDark ? "text-[#64748B]" : "text-gray-400"}`}
              >
                Fecha de creación
              </p>
              <p
                className={`text-sm ${isDark ? "text-[#94A3B8]" : "text-gray-500"}`}
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
  },
);
