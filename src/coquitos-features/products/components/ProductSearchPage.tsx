import { Search, Filter, Grid, List } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useGetCategories } from "@/coquitos-features/categories/hooks/useGetCategories";
import type { ProductStatus } from "../interfaces";

interface ProductSearchPageProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: ProductStatus | "";
  onStatusChange: (value: ProductStatus | "") => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

/**
 * Componente de búsqueda y filtros específico para productos
 * Incluye filtros por categoría, estado y selector de vista
 */
export const ProductSearchPage = ({
  searchValue,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: ProductSearchPageProps) => {
  const { isDark } = useTheme();
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategories();

  const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: "Disponible", label: "Disponible" },
    { value: "SinStock", label: "Sin Stock" },
    { value: "Descontinuado", label: "Descontinuado" },
  ];

  return (
    <div
      className={`${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E5E7EB]"
      } rounded-xl p-6 shadow-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}
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
                placeholder="Buscar por nombre, SKU, código..."
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} placeholder:${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
              />
              
              {/* Efecto de brillo al focus */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filtro por categoría */}
          <div className="min-w-[180px]">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                Categoría
              </label>
              <div className="relative group">
                <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <select
                  value={categoryFilter}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  disabled={isLoadingCategories}
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} appearance-none cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">{isLoadingCategories ? 'Cargando...' : 'Todas las categorías'}</option>
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
                <Filter className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusChange(e.target.value as ProductStatus | "")}
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} appearance-none cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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

          {/* Selector de vista */}
          <div className="min-w-[120px]">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} opacity-0`}>
                Vista
              </label>
              <div className="flex rounded-xl border-2 border-gray-200 dark:border-[#334155] overflow-hidden">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`flex-1 flex items-center justify-center px-3 py-3.5 transition-all duration-200 ${
                    viewMode === 'grid'
                      ? `${isDark ? 'bg-[#F59E0B] text-white' : 'bg-[#275081] text-white'}`
                      : `${isDark ? 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]' : 'bg-white text-gray-600 hover:bg-gray-50'}`
                  }`}
                  title="Vista de cuadrícula"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`flex-1 flex items-center justify-center px-3 py-3.5 transition-all duration-200 ${
                    viewMode === 'list'
                      ? `${isDark ? 'bg-[#F59E0B] text-white' : 'bg-[#275081] text-white'}`
                      : `${isDark ? 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]' : 'bg-white text-gray-600 hover:bg-gray-50'}`
                  }`}
                  title="Vista de lista"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};
