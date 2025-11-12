import { memo, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { OrderButtonsActions } from "./OrderButtonsActions";
import { formatDate, formatCurrency, getStatusColor, getPaymentMethodColor } from "../helpers";
import type { SearchOrdersParams, Order } from "../interfaces";
import { cn } from "@/lib/utils";

interface OrderListItemProps {
  order: Order;
  currentParams: SearchOrdersParams;
  onPageEmpty?: () => void;
}

/**
 * Item individual de orden en la lista
 * Diseño responsive con toda la información relevante
 */
export const OrderListItem = memo(({ order, currentParams, onPageEmpty }: OrderListItemProps) => {
  const { isDark } = useTheme();

  const formattedDate = useMemo(() => {
    if (!order.createdAt) return "N/A";
    return formatDate(order.createdAt);
  }, [order.createdAt]);

  const customerName = useMemo(() => {
    if (!order.customer) return "Cliente no disponible";
    return `${order.customer.firstName} ${order.customer.lastName}`;
  }, [order.customer]);

  const userName = useMemo(() => {
    if (!order.user) return "Usuario no disponible";
    return `${order.user.firstName} ${order.user.lastName}`;
  }, [order.user]);

  return (
    <div
      className={cn(
        'rounded-xl shadow-lg border p-4 hover:shadow-xl transition-all duration-200',
        isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-gray-100'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:space-x-4">
        {/* Sección izquierda: Icon + Info principal */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDark ? 'bg-gradient-to-r from-[#1E3A8A] to-[#F59E0B]' : 'bg-gradient-to-r from-[#275081] to-[#F9E44E]'
          }`}>
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base sm:text-lg font-semibold mb-1 ${
                isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
              }`}
            >
              {order.orderNumber}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                {customerName}
              </p>
            </div>
            {order.customer?.email && (
              <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-500'} truncate mt-1`}>
                {order.customer.email}
              </p>
            )}
            {order.user && (
              <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-500'} truncate mt-1`}>
                Vendedor: {userName}
              </p>
            )}
            {/* Badges para móvil */}
            <div className="flex items-center gap-2 mt-2 sm:hidden">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status || 'Pendiente')}`}>
                {order.status}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(order.paymentMethod)}`}>
                {order.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Sección derecha: Desktop */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0 self-center">
          {/* Badge de estado */}
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status || 'Pendiente')}`}>
              {order.status}
            </span>
          </div>

          {/* Badge de método de pago */}
          <div className="flex-shrink-0">
            <p className={`text-xs mb-1 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Método de pago
            </p>
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(order.paymentMethod)}`}>
              {order.paymentMethod}
            </span>
          </div>

          {/* Total */}
          <div className="flex-shrink-0 text-right min-w-[100px]">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Total
            </p>
            <p className={`text-base font-bold ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}>
              {formatCurrency(order.total)}
            </p>
          </div>

          {/* Fecha */}
          <div className="flex-shrink-0 text-right min-w-[140px]">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Fecha de creación
            </p>
            <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {formattedDate}
            </p>
          </div>

          <OrderButtonsActions order={order} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>

        {/* Móvil */}
        <div className="flex sm:hidden items-center justify-between pt-2 border-t border-gray-200 dark:border-[#334155]">
          <div className="text-left">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Total
            </p>
            <p className={`text-lg font-bold ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}>
              {formatCurrency(order.total)}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Fecha de creación
            </p>
            <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {formattedDate}
            </p>
          </div>
          <OrderButtonsActions order={order} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>
      </div>
    </div>
  );
});

