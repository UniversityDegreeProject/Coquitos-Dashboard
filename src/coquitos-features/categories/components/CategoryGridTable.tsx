import { memo } from "react";
import { type Category } from "../interfaces";
import { CategoryTable } from "./CategoryTable";
import { useTheme } from "@/shared/hooks/useTheme";

interface CategoryGridTableProps {
  categories: Category[];
  isPending: boolean;
}

/**
 * Contenedor de la tabla de categorías
 * Wrapper que proporciona estilos y estructura consistente
 */
export const CategoryGridTable = memo(({ categories, isPending }: CategoryGridTableProps) => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-lg shadow-sm border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <h2 className={`text-lg font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
          Lista de Categorías
        </h2>
      </div>
      <div className="overflow-x-auto">
        <CategoryTable categories={categories} isPending={isPending} />
      </div>
    </div>
  );
});

