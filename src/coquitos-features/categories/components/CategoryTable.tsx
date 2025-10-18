import { memo } from "react";
import { type Category } from "../interfaces";
import { CategoryItem } from "./CategoryItem";
import { SkeletonLoader } from "@/shared/loaders-Skeleton";
import { categoryTableSkeletonColumns } from "../const/categoryTableSkeleton";
import { useTheme } from "@/shared/hooks/useTheme";

interface CategoryTableProps {
  categories: Category[];
  isPending: boolean;
}

/**
 * Componente de tabla para mostrar categorías
 * Incluye skeleton loader para estados de carga
 */
export const CategoryTable = memo(({ categories, isPending }: CategoryTableProps) => {
  const { isDark } = useTheme();

  return (
    <table className="w-full">
      <thead className={`${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'}`}>
        <tr>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Categoría
          </th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Descripción
          </th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Estado
          </th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Fecha Creación
          </th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} divide-y ${isDark ? 'divide-[#334155]' : 'divide-gray-200'}`}>
        {isPending ? (
          <SkeletonLoader
            rows={3}
            columns={categoryTableSkeletonColumns}
            showAvatar={true}
            animated={true}
            isDark={isDark}
          />
        ) : (
          categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))
        )}
      </tbody>
    </table>
  );
});

