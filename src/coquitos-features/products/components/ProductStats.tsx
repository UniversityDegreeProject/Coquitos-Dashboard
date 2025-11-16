import { Package, TrendingUp, AlertTriangle, Coins } from 'lucide-react';
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

  const { totalProducts, availableProducts, lowStockProducts, nearExpirationProducts, totalValue } = productsStats;
  const { colors, isDark } = useTheme();



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Productos */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Total Productos
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {totalProducts}
            </p>
          </div>
          <Package className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
      </div>

      {/* Disponibles */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Disponibles
            </p>
            <p className={`text-2xl font-bold text-green-600`}>
              {availableProducts}
            </p>
          </div>
          <TrendingUp className={`w-8 h-8 text-green-600`} />
        </div>
      </div>

      {/* Stock Bajo */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Stock Bajo
            </p>
            <p className={`text-2xl font-bold text-red-600`}>
              {lowStockProducts}
            </p>
          </div>
          <AlertTriangle className={`w-8 h-8 text-red-600`} />
        </div>
      </div>

      {/* Próximos a Vencer */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Próximos a Vencer
            </p>
            <p className={`text-2xl font-bold text-orange-600`}>
              {nearExpirationProducts}
            </p>
          </div>
          <AlertTriangle className={`w-8 h-8 text-orange-600`} />
        </div>
      </div>

      {/* Valor Total */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Valor Total
            </p>
            <p className={`text-lg font-bold ${colors.text.primary}`}>
              Bs. {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 0 }).format(totalValue)}
            </p>
          </div>
          <Coins className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
      </div>
    </div>
  );
};

