import { memo, useState, useEffect } from "react";
import {
  X,
  User,
  Calendar,
  ShoppingCart,
  Banknote,
  Smartphone,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "@/shared/reports";
import { getSales } from "@/coquitos-features/sales/services/sale.service";
import type { Sale } from "@/coquitos-features/sales/interfaces";
import type { SellerReportItem } from "@/shared/reports";

interface SellerSalesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerReportItem | null;
  startDate: string;
  endDate: string;
}

/**
 * Modal para ver las ventas detalladas de un vendedor
 */
export const SellerSalesDetailModal = memo(
  ({
    isOpen,
    onClose,
    seller,
    startDate,
    endDate,
  }: SellerSalesDetailModalProps) => {
    const { isDark, colors } = useTheme();
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());

    // Formatear fecha para mostrar (dd/MM/yyyy)
    const formatDisplayDate = (dateStr: string) => {
      if (!dateStr) return "-";
      const parts = dateStr.split("-");
      if (parts.length !== 3) return dateStr;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    // Cargar ventas del vendedor
    useEffect(() => {
      const fetchSales = async () => {
        if (!isOpen || !seller || !startDate || !endDate) return;

        setIsLoading(true);
        try {
          // Parsear las fechas correctamente para evitar problemas de timezone
          const startDateTime = new Date(startDate + "T00:00:00");
          const endDateTime = new Date(endDate + "T23:59:59");

          const response = await getSales({
            userId: seller.userId,
            startDate: startDateTime,
            endDate: endDateTime,
            status: "Completado",
            page: 1,
            limit: 100,
          });
          setSales(response.data || []);
        } catch (error) {
          console.error("Error fetching seller sales:", error);
          setSales([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSales();
    }, [isOpen, seller, startDate, endDate]);

    // Toggle expand sale
    const toggleExpand = (saleId: string) => {
      setExpandedSales((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(saleId)) {
          newSet.delete(saleId);
        } else {
          newSet.add(saleId);
        }
        return newSet;
      });
    };

    if (!isOpen || !seller) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
          className={`${
            isDark
              ? "bg-[#1E293B] border-[#334155]"
              : "bg-white border-gray-200"
          } rounded-2xl border max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6 border-b ${
              isDark ? "border-[#334155]" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <User
                  className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${colors.text.primary}`}>
                  {seller.sellerName}
                </h2>
                <p className={`text-sm ${colors.text.muted}`}>
                  @{seller.username} • {seller.totalOrders} ventas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-[#334155]" : "hover:bg-gray-100"
              }`}
            >
              <X className={`w-6 h-6 ${colors.text.primary}`} />
            </button>
          </div>

          {/* Summary Bar */}
          <div
            className={`px-6 py-4 border-b ${
              isDark
                ? "border-[#334155] bg-[#0F172A]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${colors.text.muted}`} />
                  <span className={`text-sm ${colors.text.muted}`}>
                    {formatDisplayDate(startDate)} -{" "}
                    {formatDisplayDate(endDate)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 sm:mt-0">
                <div className="flex items-center gap-2">
                  <Banknote
                    className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`}
                  />
                  <span className={`text-sm ${colors.text.primary}`}>
                    Efectivo:{" "}
                    <span className="font-semibold">
                      {formatCurrency(seller.cashTotal)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone
                    className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                  />
                  <span className={`text-sm ${colors.text.primary}`}>
                    QR:{" "}
                    <span className="font-semibold">
                      {formatCurrency(seller.qrTotal)}
                    </span>
                  </span>
                </div>
                <div
                  className={`font-bold text-lg ${isDark ? "text-green-400" : "text-green-600"}`}
                >
                  Total: {formatCurrency(seller.totalSales)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className={`ml-3 ${colors.text.muted}`}>
                  Cargando ventas...
                </span>
              </div>
            ) : sales.length === 0 ? (
              <div className={`text-center py-12 ${colors.text.muted}`}>
                No se encontraron ventas para este vendedor en el período
                seleccionado
              </div>
            ) : (
              <div className="space-y-3">
                {sales.map((sale) => {
                  const isExpanded = expandedSales.has(sale.id || "");

                  return (
                    <div
                      key={sale.id}
                      className={`rounded-lg border transition-all ${
                        isDark
                          ? "bg-slate-700/50 border-slate-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {/* Sale Header (clickable) */}
                      <button
                        onClick={() => toggleExpand(sale.id || "")}
                        className={`w-full p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left transition-colors gap-4 ${
                          isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isDark ? "bg-blue-900/30" : "bg-blue-100"
                            }`}
                          >
                            <ShoppingCart
                              className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                            />
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${colors.text.primary}`}
                            >
                              #{sale.saleNumber}
                            </p>
                            <p className={`text-sm ${colors.text.muted}`}>
                              {sale.createdAt &&
                                format(
                                  new Date(sale.createdAt),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: es },
                                )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                          {/* Cliente */}
                          <div className="text-left sm:text-right">
                            <p className={`text-sm ${colors.text.muted}`}>
                              Cliente
                            </p>
                            <p className={`font-medium ${colors.text.primary}`}>
                              {sale.customer
                                ? `${sale.customer.firstName} ${sale.customer.lastName}`
                                : "N/A"}
                            </p>
                          </div>

                          {/* Método de pago */}
                          <div className="flex items-center gap-2">
                            {sale.paymentMethod === "Efectivo" ? (
                              <Banknote
                                className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`}
                              />
                            ) : (
                              <Smartphone
                                className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                              />
                            )}
                            <span className={`text-sm ${colors.text.muted}`}>
                              {sale.paymentMethod}
                            </span>
                          </div>

                          {/* Total */}
                          <div
                            className={`font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
                          >
                            {formatCurrency(sale.total)}
                          </div>

                          {/* Expand icon */}
                          {isExpanded ? (
                            <ChevronUp
                              className={`w-5 h-5 ${colors.text.muted}`}
                            />
                          ) : (
                            <ChevronDown
                              className={`w-5 h-5 ${colors.text.muted}`}
                            />
                          )}
                        </div>
                      </button>

                      {/* Expanded Content - Products */}
                      {isExpanded && sale.items && sale.items.length > 0 && (
                        <div
                          className={`px-4 pb-4 border-t ${
                            isDark ? "border-slate-600" : "border-gray-200"
                          }`}
                        >
                          <div className="pt-4">
                            <p
                              className={`text-sm font-semibold mb-2 ${colors.text.muted}`}
                            >
                              <Package className="w-4 h-4 inline mr-1" />
                              Productos ({sale.items.length})
                            </p>
                            <div className="space-y-2">
                              {sale.items.map((item, index) => (
                                <div
                                  key={item.id || index}
                                  className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                                    isDark ? "bg-slate-800/50" : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                        isDark
                                          ? "bg-slate-600 text-gray-300"
                                          : "bg-gray-200 text-gray-600"
                                      }`}
                                    >
                                      {item.quantity}
                                    </span>
                                    <span className={`${colors.text.primary}`}>
                                      {item.product?.name || "Producto"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span
                                      className={`text-sm ${colors.text.muted}`}
                                    >
                                      {formatCurrency(item.unitPrice)} c/u
                                    </span>
                                    <span
                                      className={`font-medium ${colors.text.primary}`}
                                    >
                                      {formatCurrency(item.total)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`flex justify-end gap-3 p-6 border-t ${
              isDark ? "border-[#334155]" : "border-gray-200"
            }`}
          >
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                isDark
                  ? "bg-[#334155] text-white hover:bg-[#475569]"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  },
);

SellerSalesDetailModal.displayName = "SellerSalesDetailModal";
