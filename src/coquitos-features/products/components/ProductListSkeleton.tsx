import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";

/**
 * Componente de skeleton para la vista en lista de productos
 * Muestra 6 placeholders animados mientras cargan los datos
 */
export const ProductListSkeleton = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-xl shadow-sm ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-4`}
        >
          <div className="flex items-center space-x-4">
            {/* Imagen */}
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0" />
            
            {/* Información */}
            <div className="flex-1 min-w-0">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>

            {/* Precio */}
            <div className="text-right">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>

            {/* Acciones */}
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg" />
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

