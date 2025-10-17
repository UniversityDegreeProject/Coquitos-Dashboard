import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { CategoryCard } from "./CategoryCard";
import type { Category } from "../interfaces";

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

/**
 * Grid responsivo para mostrar categorías
 * Incluye estado de carga y diseño adaptativo
 */
export const CategoryGrid = memo(({ 
  categories, 
  isLoading = false, 
  onEdit, 
  onDelete 
}: CategoryGridProps) => {
  const { isDark } = useTheme();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`animate-pulse rounded-xl shadow-lg ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}
          >
            {/* Gradiente superior */}
            <div className="h-2 bg-gray-300 dark:bg-gray-600" />
            
            {/* Contenido */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#334155]">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-12 text-center`}>
        <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${isDark ? 'bg-[#0F172A]' : 'bg-gray-100'} flex items-center justify-center`}>
          <svg className={`w-12 h-12 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
          No hay categorías
        </h3>
        <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Comienza agregando tu primera categoría
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});
