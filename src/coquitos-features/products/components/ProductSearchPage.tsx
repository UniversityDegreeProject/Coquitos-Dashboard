import { memo, /* useCallback, useMemo */ } from "react";
import { Search, Users, Tag, AlertTriangle, Clock } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { statusOptions } from "../const/status-options";
import type { ProductStatus } from "../interfaces";
import type { Category } from "@/coquitos-features/categories/interfaces";

interface ProductSearchPageProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProductStatus | "";
  onStatusChange: (value: ProductStatus | "") => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  lowStockFilter: boolean;
  onLowStockChange: (value: boolean) => void;
  nearExpirationFilter: boolean;
  onNearExpirationChange: (value: boolean) => void;
  categories: Category[];
  isLoadingCategories: boolean;
}

export const ProductSearchPage = memo(({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  lowStockFilter,
  onLowStockChange,
  nearExpirationFilter,
  onNearExpirationChange,
  categories,
  isLoadingCategories,
}: ProductSearchPageProps) => {

  const { isDark } = useTheme();

  // // Memoizar el callback para limpiar filtros
  // const handleClearFilters = useCallback(() => {
  //   onSearchChange('');
  //   onStatusChange('');
  // }, [onSearchChange, onStatusChange]);

  // // Detectar si hay filtros activos
  // const hasActiveFilters = useMemo(() => {
  //   return Boolean(searchValue || statusFilter);
  // }, [searchValue, statusFilter]);

  return (
    <div
      className={`${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E5E7EB]"
      } rounded-xl p-6 shadow-sm border backdrop-blur-sm transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo de búsqueda principal */}
        <div className="flex-1">
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
              Buscar productos...
            </label>
            <div className="relative group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por nombre, descripción, código..."
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-2 ring-offset-1 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} placeholder:${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
              />
              
              {/* Efecto de brillo al focus */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Filtro por categoría */}
          <div className="min-w-[200px]">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                Categoría
              </label>
              <div className="relative group">
                <Tag className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
                <select
                  value={categoryFilter}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  disabled={isLoadingCategories}
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-2 ring-offset-1 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} appearance-none cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'} ${isLoadingCategories ? 'opacity-50' : ''}`}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className={`w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="min-w-[180px]">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                Estado
              </label>
              <div className="relative group">
                <Users className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusChange(e.target.value as ProductStatus | "")}
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-2 ring-offset-1 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} appearance-none cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
                >
                  <option value="">Todos los estados</option>
                  {statusOptions.map((option) => {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className={`w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros Especiales (Checkboxes) */}
          <div className="flex flex-col gap-2 min-w-[160px]">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                Filtros Especiales
              </label>
              {/* Filtro de Stock Bajo */}
              <label className={`flex items-center px-4 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm transition-all duration-200 cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'} ${lowStockFilter ? isDark ? 'border-[#F59E0B] ring-2 ring-offset-1 ring-[#F59E0B]/20' : 'border-[#275081] ring-2 ring-offset-1 ring-[#275081]/20' : ''}`}>
                <input
                  type="checkbox"
                  checked={lowStockFilter}
                  onChange={(e) => onLowStockChange(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <AlertTriangle className={`w-4 h-4 ml-2 mr-1 ${lowStockFilter ? 'text-orange-500' : isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`} />
                <span className={`text-sm font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                  Solo Stock Bajo
                </span>
              </label>
              {/* Filtro de Próximos a Vencer */}
              <label className={`flex items-center px-4 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm transition-all duration-200 cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'} ${nearExpirationFilter ? isDark ? 'border-[#F59E0B] ring-2 ring-offset-1 ring-[#F59E0B]/20' : 'border-[#275081] ring-2 ring-offset-1 ring-[#275081]/20' : ''}`}>
                <input
                  type="checkbox"
                  checked={nearExpirationFilter}
                  onChange={(e) => onNearExpirationChange(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <Clock className={`w-4 h-4 ml-2 mr-1 ${nearExpirationFilter ? 'text-red-500' : isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`} />
                <span className={`text-sm font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                  Próximos a Vencer
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de resultados */}
      {/* {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#334155]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              {searchValue && (
                <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                  Buscando: <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>"{searchValue}"</span>
                </span>
              )}
              {statusFilter && (
                <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                  Estado: <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>{statusFilter}</span>
                </span>
              )}
              {availableProducts && (
                <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                  Disponibles: <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>{availableProducts}</span>
                </span>
              )}
              {lowStockProducts && (
                <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                  Stock bajo: <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>{lowStockProducts}</span>
                </span>
              )}
              {totalValue && (
                <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                  Valor total: <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>{totalValue}</span>
                </span>
              )}
            </div>
            <button
              onClick={handleClearFilters}
              className={`text-sm ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
});

