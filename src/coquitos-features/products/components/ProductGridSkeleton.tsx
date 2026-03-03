import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";

/**
 * Componente de skeleton para la vista en cuadrícula de productos
 * Muestra 8 placeholders animados mientras cargan los datos
 */
export const ProductGridSkeleton = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-xl shadow-sm ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}
        >
          {/* Imagen */}
          <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-t-xl" />
          
          {/* Contenido */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
            
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#334155]">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

