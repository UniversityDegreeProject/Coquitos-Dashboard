import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency, formatPercentage } from "@/shared/reports";
import type { ProductsReport } from "../interfaces";

interface TopProductsListProps {
  report: ProductsReport;
}

/**
 * Componente para mostrar la lista de productos más vendidos
 */
export const TopProductsList = ({ report }: TopProductsListProps) => {
  const { isDark } = useTheme();

  if (report.products.length === 0) {
    return (
      <div
        className={`rounded-lg p-6 shadow-sm border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
          Productos Más Vendidos
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-500"}>No hay productos para mostrar</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-6 shadow-sm border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      }`}
    >
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
        Productos Más Vendidos
      </h2>
      <div className="space-y-3">
        {report.products.map((product, index) => (
          <div
            key={product.productId}
            className={`flex items-center justify-between py-3 border-b ${
              isDark ? "border-slate-700" : "border-gray-100"
            } last:border-b-0`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? "bg-orange-900/30" : "bg-orange-100"
                }`}
              >
                <span className={`font-semibold text-sm ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                  {index + 1}
                </span>
              </div>
              <div>
                <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-800"}`}>
                  {product.productName}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {product.quantitySold} unidades
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                {formatCurrency(product.totalRevenue)}
              </span>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {formatPercentage(product.percentage)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

