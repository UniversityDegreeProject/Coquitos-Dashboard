import { memo, useMemo } from "react";
import { type Category } from "../interfaces";
import { getStatusColor } from "../helpers";
import { Layers } from "lucide-react";
import { CategoryButtonsActions } from "./CategoryButtonsActions";
import { useTheme } from "@/shared/hooks/useTheme";

interface CategoryItemProps {
  category: Category;
}

/**
 * Componente de fila de tabla para mostrar información de una categoría
 */
export const CategoryItem = memo(({ category }: CategoryItemProps) => {
  const { isDark } = useTheme();

  const formattedDate = useMemo(() => {
    if (!category.createdAt) return 'N/A';

    return new Date(category.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [category.createdAt]);

  // Detectar si es una mutación optimista
  const isOptimistic = (category as Category).isOptimistic;

  return (
    <tr className={`${isDark ? 'hover:bg-[#334155]/20' : 'hover:bg-gray-50'} transition-colors ${isOptimistic ? 'animate-pulse opacity-60' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="ml-4">
            <div className={`text-sm font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
              {category.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'} line-clamp-2 max-w-md`}>
          {category.description || 'Sin descripción'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            category.status
          )}`}
        >
          {category.status}
        </span>
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
        {formattedDate}
      </td>
      <CategoryButtonsActions category={category} />
    </tr>
  );
});

