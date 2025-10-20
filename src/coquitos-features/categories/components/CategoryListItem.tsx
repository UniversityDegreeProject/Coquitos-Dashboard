import { memo, useMemo } from "react";
import { Layers } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { CategoryButtonsActions } from "./CategoryButtonsActions";
import { getStatusColor } from "../helpers";
import type { Category } from "../interfaces";

interface CategoryListItemProps {
  category: Category;
}

/**
 * Componente reutilizable para cada item de categoría en la lista
 * Muestra información completa con acciones integradas
 */
export const CategoryListItem = memo(({ category }: CategoryListItemProps) => {
  const { isDark } = useTheme();

  // Detectar si es una mutación optimista
  const isOptimistic = category.isOptimistic;

  // Formatear fecha (memoizado)
  const formattedDate = useMemo(() => {
    if (!category.createdAt) return 'N/A';
    return new Date(category.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [category.createdAt]);

  return (
    <div
      className={`${
        isDark ? 'bg-[#1E293B]' : 'bg-white'
      } rounded-xl shadow-lg border ${
        isDark ? 'border-[#334155]' : 'border-gray-100'
      } p-4 hover:shadow-xl transition-all duration-200 ${
        isOptimistic ? 'animate-pulse opacity-60' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Icono de categoría */}
        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Layers className="w-6 h-6 text-white" />
        </div>

        {/* Información principal */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 ${
              isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
            }`}
          >
            {category.name}
          </h3>
          <p
            className={`text-sm ${
              isDark ? 'text-[#94A3B8]' : 'text-gray-600'
            } line-clamp-2`}
          >
            {category.description || 'Sin descripción'}
          </p>
        </div>

        {/* Estado */}
        <div className="flex-shrink-0">
          <span
            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              category.status
            )}`}
          >
            {category.status}
          </span>
        </div>

        {/* Fecha */}
        <div className="flex-shrink-0 text-right min-w-[100px]">
          <p
            className={`text-sm ${
              isDark ? 'text-[#94A3B8]' : 'text-gray-500'
            }`}
          >
            {formattedDate}
          </p>
        </div>

        {/* Acciones */}
        <CategoryButtonsActions category={category} />
      </div>
    </div>
  );
});

