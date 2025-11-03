import { memo, useMemo } from "react";
import { Layers } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { CategoryButtonsActions } from "./CategoryButtonsActions";
import { formateDatetime, getStatusColor } from "../helpers";
import type { Category, SearchCategoriesParams } from "../interfaces";
import { cn } from "@/lib/utils";

interface CategoryListItemProps {
  category: Category;
  currentParams: SearchCategoriesParams;
  onPageEmpty?: () => void;
}

export const CategoryListItem = memo(({ category, currentParams, onPageEmpty }: CategoryListItemProps) => {
  const { isDark } = useTheme();
  
  


  const formattedCreatedAt = useMemo(() => {
    if( !category.createdAt ) return "Nunca";
    return formateDatetime(category.createdAt );
  }, [category.createdAt]);



  return (
    <div
      className={cn(
        'rounded-xl shadow-lg border p-4 hover:shadow-xl transition-all duration-200',
        isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-gray-100'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:space-x-4">
        {/* Sección izquierda: Avatar + Info principal */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Layers className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base sm:text-lg font-semibold mb-1 ${
                isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
              }`}
            >
              {category.name}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                {category.description}
              </p>
              <span className={isDark ? 'text-[#64748B]' : 'text-gray-400'}>•</span>
              <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                {category.status}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:hidden">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                {category.status}
              </span>
            </div>
          </div>
        </div>

        {/* Sección derecha: Desktop */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0 self-center">
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
              {category.status}
            </span>
          </div>

          <div className="flex-shrink-0 text-right min-w-[140px]">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Fecha de creación
            </p>
            <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {formattedCreatedAt}
            </p>
          </div>

          {/* Pasar el callback */}
          <CategoryButtonsActions category={category} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>

        {/* Móvil */}
        <div className="flex sm:hidden items-center justify-between pt-2 border-t border-gray-200 dark:border-[#334155]">
          <div className="text-left">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Fecha de creación
            </p>
            <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {formattedCreatedAt}
            </p>
          </div>
          {/* Pasar el callback */}
          <CategoryButtonsActions category={category} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>
      </div>
    </div>
  );
});