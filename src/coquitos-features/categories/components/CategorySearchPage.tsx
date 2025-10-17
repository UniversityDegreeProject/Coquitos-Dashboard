import { Search, Filter } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface CategorySearchPageProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

/**
 * Componente de búsqueda específico para categorías
 * Diseño elegante con efectos y animaciones
 */
export const CategorySearchPage = ({
  searchValue,
  onSearchChange,
}: CategorySearchPageProps) => {
  const { isDark } = useTheme();

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

        {/* Botón de filtros (para futuras expansiones) */}
        <div className="lg:min-w-[120px]">
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} opacity-0`}>
              Filtros
            </label>
            <button
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] hover:border-[#475569]' : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'} transition-all duration-200 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} hover:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}
              title="Filtros avanzados (próximamente)"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de resultados (opcional) */}
      {searchValue && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#334155]">
          <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
            Buscando: <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>"{searchValue}"</span>
          </p>
        </div>
      )}
    </div>
  );
};
