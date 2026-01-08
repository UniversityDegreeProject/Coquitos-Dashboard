//* Librerias
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ShoppingCart,
  User,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Printer,
  Package,
} from "lucide-react";

//* Others
import { useTheme } from "@/shared/hooks/useTheme";
import { formatDateTime } from "@/shared/helpers";
import { paths } from "@/router/paths";
import { useGetSaleById } from "../hooks";
import {
  formatCurrency,
  getStatusColor,
  getPaymentMethodColor,
} from "../helpers";

/**
 * Página de detalle de una venta
 * Muestra toda la información de la venta incluyendo items, cliente, vendedor, etc.
 * Diseño responsive con soporte para modo oscuro/claro
 */
export const SaleDetailPage = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();

  // Obtener venta por ID desde la URL
  const { sale, isLoading } = useGetSaleById();

  // Manejador para volver
  const handleGoBack = () => {
    navigate(paths.dashboard.sales);
  };

  // Manejador para imprimir
  const handlePrint = () => {
    window.print();
  };

  // Formatear fecha
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return formatDateTime(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDark ? "border-[#F59E0B]" : "border-[#275081]"
          }`}
        ></div>
      </div>
    );
  }

  if (!sale) {
    // Si no se encuentra la venta, redirigir a la página 404
    navigate("/dashboard/404", { replace: true });
    return null;
  }

  const customerName = sale.customer
    ? `${sale.customer.firstName} ${sale.customer.lastName}`
    : "Cliente no disponible";

  const userName = sale.user
    ? `${sale.user.firstName} ${sale.user.lastName}`
    : "Usuario no disponible";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con botón de volver y imprimir - Oculto en impresión */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={handleGoBack}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm ${
            isDark
              ? "bg-[#1E293B] hover:bg-[#334155]"
              : "bg-white hover:bg-gray-50"
          } border ${isDark ? "border-[#334155]" : "border-gray-200"}`}
        >
          <ArrowLeft className={`w-5 h-5 ${colors.text.primary}`} />
          <span className={`font-medium ${colors.text.primary}`}>Volver</span>
        </button>

        <button
          onClick={handlePrint}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm ${
            isDark
              ? "bg-[#1E293B] hover:bg-[#334155] border-[#334155]"
              : "bg-white hover:bg-gray-50 border-gray-200"
          } border`}
        >
          <Printer
            className={`w-5 h-5 ${
              isDark ? "text-[#F59E0B]" : "text-[#275081]"
            }`}
          />
          <span
            className={`font-medium ${
              isDark ? "text-[#F59E0B]" : "text-[#275081]"
            }`}
          >
            Imprimir
          </span>
        </button>
      </div>

      {/* Card principal con información de la venta */}
      <div
        className={`print-content ${
          isDark ? "bg-[#1E293B]" : "bg-white"
        } rounded-xl shadow-lg border ${
          isDark ? "border-[#334155]" : "border-gray-100"
        } overflow-hidden`}
      >
        {/* Banner superior con gradiente */}
        <div
          className={`h-32 bg-gradient-to-r ${colors.gradient.accent} relative`}
        >
          <div className="absolute -bottom-16 left-4 sm:left-8">
            <div
              className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full ${
                isDark ? "bg-[#1E293B]" : "bg-white"
              } p-2 shadow-xl`}
            >
              <div
                className={`w-full h-full rounded-full bg-gradient-to-br ${colors.gradient.accent} flex items-center justify-center`}
              >
                <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="pt-20 sm:pt-24 px-4 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold mb-2 ${colors.text.primary}`}
              >
                {sale.saleNumber || "Venta sin número"}
              </h1>
              <p className={`text-base sm:text-lg ${colors.text.secondary}`}>
                {customerName}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(
                  sale.status || "Pendiente"
                )} shadow-md`}
              >
                {sale.status || "Pendiente"}
              </span>
              <span
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${getPaymentMethodColor(
                  sale.paymentMethod
                )} shadow-md`}
              >
                {sale.paymentMethod}
              </span>
            </div>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Cliente */}
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-[#0F172A]" : "bg-gray-50"
              } border ${isDark ? "border-[#334155]" : "border-gray-200"}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <User
                  className={`w-5 h-5 ${
                    isDark ? "text-[#F59E0B]" : "text-[#275081]"
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${colors.text.secondary}`}
                >
                  Cliente
                </span>
              </div>
              <p
                className={`text-base sm:text-lg font-medium ${colors.text.primary}`}
              >
                {customerName}
              </p>
              {sale.customer?.email && (
                <p className={`text-sm mt-1 ${colors.text.secondary}`}>
                  {sale.customer.email}
                </p>
              )}
              {sale.customer?.phone && (
                <p className={`text-sm mt-1 ${colors.text.secondary}`}>
                  {sale.customer.phone}
                </p>
              )}
            </div>

            {/* Vendedor */}
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-[#0F172A]" : "bg-gray-50"
              } border ${isDark ? "border-[#334155]" : "border-gray-200"}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <User
                  className={`w-5 h-5 ${
                    isDark ? "text-[#F59E0B]" : "text-[#275081]"
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${colors.text.secondary}`}
                >
                  Vendedor
                </span>
              </div>
              <p
                className={`text-base sm:text-lg font-medium ${colors.text.primary}`}
              >
                {userName}
              </p>
              {sale.user?.email && (
                <p className={`text-sm mt-1 ${colors.text.secondary}`}>
                  {sale.user.email}
                </p>
              )}
            </div>

            {/* Método de pago */}
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-[#0F172A]" : "bg-gray-50"
              } border ${isDark ? "border-[#334155]" : "border-gray-200"}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <CreditCard
                  className={`w-5 h-5 ${
                    isDark ? "text-[#F59E0B]" : "text-[#275081]"
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${colors.text.secondary}`}
                >
                  Método de Pago
                </span>
              </div>
              <p
                className={`text-base sm:text-lg font-medium ${colors.text.primary}`}
              >
                {sale.paymentMethod}
              </p>
            </div>

            {/* Fecha de creación */}
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-[#0F172A]" : "bg-gray-50"
              } border ${isDark ? "border-[#334155]" : "border-gray-200"}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Calendar
                  className={`w-5 h-5 ${
                    isDark ? "text-[#F59E0B]" : "text-[#275081]"
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${colors.text.secondary}`}
                >
                  Fecha de Venta
                </span>
              </div>
              <p
                className={`text-base sm:text-lg font-medium ${colors.text.primary}`}
              >
                {formatDate(sale.createdAt)}
              </p>
            </div>

            {/* Monto pagado */}
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-[#0F172A]" : "bg-gray-50"
              } border ${isDark ? "border-[#334155]" : "border-gray-200"}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign
                  className={`w-5 h-5 ${
                    isDark ? "text-[#F59E0B]" : "text-[#275081]"
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${colors.text.secondary}`}
                >
                  Monto Pagado
                </span>
              </div>
              <p
                className={`text-base sm:text-lg font-medium ${colors.text.primary}`}
              >
                {formatCurrency(sale.amountPaid)}
              </p>
              {sale.change > 0 && (
                <p className={`text-sm mt-1 ${colors.text.secondary}`}>
                  Cambio: {formatCurrency(sale.change)}
                </p>
              )}
            </div>

            {/* Última actualización */}
            {sale.updatedAt && (
              <div
                className={`p-4 rounded-xl ${
                  isDark ? "bg-[#0F172A]" : "bg-gray-50"
                } border ${isDark ? "border-[#334155]" : "border-gray-200"}`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Clock
                    className={`w-5 h-5 ${
                      isDark ? "text-[#F59E0B]" : "text-[#275081]"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${colors.text.secondary}`}
                  >
                    Última Actualización
                  </span>
                </div>
                <p
                  className={`text-base sm:text-lg font-medium ${colors.text.primary}`}
                >
                  {formatDate(sale.updatedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card de items de la venta */}
      <div
        className={`${
          isDark ? "bg-[#1E293B]" : "bg-white"
        } rounded-xl shadow-lg border ${
          isDark ? "border-[#334155]" : "border-gray-100"
        } p-4 sm:p-6`}
      >
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Package
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDark ? "text-[#F59E0B]" : "text-[#275081]"
            }`}
          />
          <h2
            className={`text-xl sm:text-2xl font-bold ${colors.text.primary}`}
          >
            Productos Vendidos
          </h2>
        </div>

        {sale.items && sale.items.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {sale.items.map((item, index) => (
              <div
                key={item.id || index}
                className={`p-4 rounded-xl border ${
                  isDark
                    ? "bg-[#0F172A] border-[#334155]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3
                      className={`text-base sm:text-lg font-semibold mb-1 ${colors.text.primary}`}
                    >
                      {item.product?.name || "Producto no disponible"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                      <span className={colors.text.secondary}>
                        Cantidad:{" "}
                        <span className="font-semibold">{item.quantity}</span>
                      </span>
                      <span className={colors.text.secondary}>
                        Precio unitario:{" "}
                        <span className="font-semibold">
                          {formatCurrency(item.unitPrice)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p
                      className={`text-lg sm:text-xl font-bold ${
                        isDark ? "text-[#F59E0B]" : "text-[#275081]"
                      }`}
                    >
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${colors.text.secondary}`}>
            <p>No hay productos en esta venta</p>
          </div>
        )}
      </div>

      {/* Card de resumen financiero */}
      <div
        className={`print-content ${
          isDark ? "bg-[#1E293B]" : "bg-white"
        } rounded-xl shadow-lg border ${
          isDark ? "border-[#334155]" : "border-gray-100"
        } p-4 sm:p-6`}
      >
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <FileText
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDark ? "text-[#F59E0B]" : "text-[#275081]"
            }`}
          />
          <h2
            className={`text-xl sm:text-2xl font-bold ${colors.text.primary}`}
          >
            Resumen Financiero
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div
            className={`flex justify-between items-center p-3 sm:p-4 rounded-lg ${
              isDark ? "bg-[#0F172A]" : "bg-gray-50"
            }`}
          >
            <span className={`text-sm sm:text-base ${colors.text.secondary}`}>
              Subtotal:
            </span>
            <span
              className={`text-base sm:text-lg font-semibold ${colors.text.primary}`}
            >
              {formatCurrency(sale.subtotal)}
            </span>
          </div>

          <div
            className={`flex justify-between items-center p-3 sm:p-4 rounded-lg ${
              isDark ? "bg-[#0F172A]" : "bg-gray-50"
            }`}
          >
            <span className={`text-sm sm:text-base ${colors.text.secondary}`}>
              Impuestos:
            </span>
            <span
              className={`text-base sm:text-lg font-semibold ${colors.text.primary}`}
            >
              {formatCurrency(sale.tax)}
            </span>
          </div>

          <div
            className={`flex justify-between items-center p-3 sm:p-4 rounded-lg border-2 ${
              isDark
                ? "bg-[#0F172A] border-[#F59E0B]"
                : "bg-gray-50 border-[#275081]"
            }`}
          >
            <span
              className={`text-base sm:text-lg font-bold ${colors.text.primary}`}
            >
              Total:
            </span>
            <span
              className={`text-xl sm:text-2xl font-bold ${
                isDark ? "text-[#F59E0B]" : "text-[#275081]"
              }`}
            >
              {formatCurrency(sale.total)}
            </span>
          </div>
        </div>

        {/* Notas si existen */}
        {sale.notes && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-[#334155]">
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 ${colors.text.secondary}`}
            >
              Notas:
            </h3>
            <p className={`text-sm sm:text-base ${colors.text.primary}`}>
              {sale.notes}
            </p>
          </div>
        )}
      </div>

      {/* Estilos para impresión */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-content,
            .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            button {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};
