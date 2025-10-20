import { memo, useCallback, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { statusOptions } from "../const";
import type { CategoryStatus } from "../interfaces";

interface CategorySearchPageProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter?: CategoryStatus | "";
  onStatusChange?: (value: CategoryStatus | "") => void;
}

/**
 * Componente de búsqueda y filtros para categorías
 * Diseño elegante con efectos, animaciones y optimizado con memoización
 */
export const CategorySearchPage = memo(({
  searchValue,
  onSearchChange,
  statusFilter = "",
  onStatusChange,
}: CategorySearchPageProps) => {
  const { isDark } = useTheme();

  // Memoizar el callback para limpiar filtros
  const handleClearFilters = useCallback(() => {
    onSearchChange('');
    if (onStatusChange) {
      onStatusChange('');
    }
  }, [onSearchChange, onStatusChange]);

  // Detectar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return Boolean(searchValue || statusFilter);
  }, [searchValue, statusFilter]);

  return (
    <div
      className={`${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E5E7EB]"
      } rounded-xl p-6 shadow-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo de búsqueda */}
        <div className="flex-1">
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
              Buscar categorías...
            </label>
            <div className="relative group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por nombre, descripción..."
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} placeholder:${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
              />
              
              {/* Efecto de brillo al focus */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filtro de estado */}
        {onStatusChange && (
          <div className="min-w-[180px]">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                Estado
              </label>
              <div className="relative group">
                <Filter className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusChange(e.target.value as CategoryStatus | "")}
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} appearance-none cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
                >
                  <option value="">Todos los estados</option>
                  {statusOptions.map((option) => {
                    if (option.value === "") {
                      return null;
                    }
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
        )}
      </div>

      {/* Indicador de resultados */}
      {hasActiveFilters && (
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
            </div>
            <button
              onClick={handleClearFilters}
              className={`text-sm ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
