import { memo, useState } from "react";
import { User, Banknote, Smartphone, Eye } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency, formatPercentage } from "@/shared/reports";
import type { SellersReport, SellerReportItem } from "@/shared/reports";
import { SellerSalesDetailModal } from "./SellerSalesDetailModal";

interface SellerPerformanceListProps {
  report: SellersReport;
  startDate: string;
  endDate: string;
}

/**
 * Componente para mostrar el rendimiento de vendedores
 * Solo visible para administradores
 * Click en un vendedor para ver el detalle de sus ventas
 */
export const SellerPerformanceList = memo(
  ({ report, startDate, endDate }: SellerPerformanceListProps) => {
    const { isDark } = useTheme();
    const [selectedSeller, setSelectedSeller] =
      useState<SellerReportItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSellerClick = (seller: SellerReportItem) => {
      setSelectedSeller(seller);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedSeller(null);
    };

    if (report.sellers.length === 0) {
      return (
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <User
              className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
            <h2
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Ventas por Vendedor
            </h2>
          </div>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            No hay ventas registradas en este período
          </p>
        </div>
      );
    }

    // Calcular totales
    const totalSales = report.sellers.reduce((sum, s) => sum + s.totalSales, 0);
    const totalOrders = report.sellers.reduce(
      (sum, s) => sum + s.totalOrders,
      0,
    );

    return (
      <>
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User
                className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
              />
              <h2
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Ventas por Vendedor
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Click para ver detalle
              </span>
              <div
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {totalOrders} ventas • {formatCurrency(totalSales)}
              </div>
            </div>
          </div>

          {/* Lista de vendedores */}
          <div className="space-y-4">
            {report.sellers.map((seller, index) => (
              <button
                key={seller.userId}
                onClick={() => handleSellerClick(seller)}
                className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-blue-500/50"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-blue-300"
                }`}
              >
                {/* Fila principal */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Ranking */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                          : index === 1
                            ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            : index === 2
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
                              : isDark
                                ? "bg-slate-600 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Nombre del vendedor */}
                    <div>
                      <p
                        className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        {seller.sellerName}
                      </p>
                      <p
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        @{seller.username} • {seller.totalOrders}{" "}
                        {seller.totalOrders === 1 ? "venta" : "ventas"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Total y porcentaje */}
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${isDark ? "text-green-400" : "text-green-600"}`}
                      >
                        {formatCurrency(seller.totalSales)}
                      </p>
                      <p
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {formatPercentage(seller.percentage)}
                      </p>
                    </div>

                    {/* Icono de ver */}
                    <div
                      className={`p-2 rounded-lg ${
                        isDark ? "bg-blue-900/30" : "bg-blue-100"
                      }`}
                    >
                      <Eye
                        className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Desglose por método de pago */}
                <div
                  className={`flex items-center gap-4 pt-3 border-t border-dashed ${
                    isDark ? "border-slate-600" : "border-gray-300"
                  }`}
                >
                  {seller.cashTotal > 0 && (
                    <div className="flex items-center gap-2">
                      <Banknote
                        className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`}
                      />
                      <span
                        className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                      >
                        Efectivo:{" "}
                        <span className="font-medium">
                          {formatCurrency(seller.cashTotal)}
                        </span>
                      </span>
                    </div>
                  )}
                  {seller.qrTotal > 0 && (
                    <div className="flex items-center gap-2">
                      <Smartphone
                        className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                      />
                      <span
                        className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                      >
                        QR:{" "}
                        <span className="font-medium">
                          {formatCurrency(seller.qrTotal)}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Barra de progreso */}
                <div className="mt-3">
                  <div
                    className={`h-2 rounded-full overflow-hidden ${
                      isDark ? "bg-slate-600" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                      style={{ width: `${seller.percentage}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal de detalle de ventas */}
        <SellerSalesDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          seller={selectedSeller}
          startDate={startDate}
          endDate={endDate}
        />
      </>
    );
  },
);

SellerPerformanceList.displayName = "SellerPerformanceList";
