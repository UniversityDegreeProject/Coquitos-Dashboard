import { memo, useMemo } from "react";
import { Layers, CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface CategoryStatsProps {
  totalCategories : number;
  activeCategories : number;
  inactiveCategories : number;
}

/**
 * Componente que muestra estadísticas de usuarios
 * Diseño consistente con ProductStats y CategoryStats
 */
export const CategoryStats = memo(({ totalCategories, activeCategories, inactiveCategories }: CategoryStatsProps) => {
  const { colors, isDark } = useTheme();

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = totalCategories;
    const active = activeCategories;
    const inactive = inactiveCategories;

    return { total, active, inactive };
  }, [totalCategories, activeCategories, inactiveCategories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Categorías */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Total Categorías
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {stats.total}
            </p>
          </div>
          <Layers className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
      </div>

      {/* Categorías Activas */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Categorías Activas
            </p>
            <p className={`text-2xl font-bold text-green-600`}>
              {stats.active}
            </p>
          </div>
          <CheckCircle className={`w-8 h-8 text-green-600`} />
        </div>
      </div>

      {/* Categorías Inactivas */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Categorías Inactivas
            </p>
            <p className={`text-2xl font-bold text-red-600`}>
              {stats.inactive}
            </p>
          </div>
          <XCircle className={`w-8 h-8 text-red-600`} />
        </div>
      </div>
    </div>
  );
});

