import { Package, TrendingUp, AlertTriangle, Coins } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { ProductsStatsData } from "../hooks";

interface ProductStatsProps {
  productsStats: ProductsStatsData;
}

/**
 * Componente de estadísticas para productos
 * Muestra: Total, Disponibles, Stock Bajo, Valor Total
 */
export const ProductStats = ({ productsStats }: ProductStatsProps) => {
  const {
    totalProducts,
    availableProducts,
    lowStockProducts,
    nearExpirationProducts,
    totalValue,
  } = productsStats;
  const { colors, isDark } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Productos */}
      <div
        className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
            >
              Total Productos
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {totalProducts}
            </p>
          </div>
          <div
            className={`p-2.5 rounded-xl ${isDark ? "bg-[#F59E0B]/10" : "bg-[#275081]/10"}`}
          >
            <Package
              className={`w-6 h-6 ${isDark ? "text-[#F59E0B]" : "text-[#275081]"}`}
            />
          </div>
        </div>
      </div>

      {/* Disponibles */}
      <div
        className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
            >
              Disponibles
            </p>
            <p
              className={`text-2xl font-bold text-green-600 dark:text-green-400`}
            >
              {availableProducts}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/30">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Stock Bajo */}
      <div
        className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
            >
              Stock Bajo
            </p>
            <p className={`text-2xl font-bold text-red-600 dark:text-red-400`}>
              {lowStockProducts}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Próximos a Vencer */}
      <div
        className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
            >
              Próximos a Vencer
            </p>
            <p
              className={`text-2xl font-bold text-orange-600 dark:text-orange-400`}
            >
              {nearExpirationProducts}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Valor Total */}
      <div
        className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
            >
              Valor Total
            </p>
            <p className={`text-lg font-bold ${colors.text.primary}`}>
              Bs.{" "}
              {new Intl.NumberFormat("es-BO", {
                minimumFractionDigits: 0,
              }).format(totalValue)}
            </p>
          </div>
          <div
            className={`p-2.5 rounded-xl ${isDark ? "bg-[#F59E0B]/10" : "bg-[#275081]/10"}`}
          >
            <Coins
              className={`w-6 h-6 ${isDark ? "text-[#F59E0B]" : "text-[#275081]"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
