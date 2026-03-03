import { Filter, Search } from 'lucide-react';
import { useTheme } from "@/shared/hooks/useTheme";
import { movementTypeOptions } from "../const/movement-types";
import type { StockMovementType } from "../interfaces";

interface StockMovementsFiltersProps {
  searchTerm: string;
  typeFilter: StockMovementType | "";
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: StockMovementType | "") => void;
}

/**
 * Filtros de búsqueda para movimientos de stock
 */
export const StockMovementsFilters = ({
  searchTerm,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
}: StockMovementsFiltersProps) => {
  const { colors, isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.text.muted}`} />
          <input
            type="text"
            placeholder="Buscar por referencia, razón o notas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-[#334155]' : 'border-gray-300'} ${isDark ? 'bg-[#0F172A]' : 'bg-white'} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Filtro por tipo */}
        <div className="relative">
          <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.text.muted}`} />
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as StockMovementType | "")}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-[#334155]' : 'border-gray-300'} ${isDark ? 'bg-[#0F172A]' : 'bg-white'} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Todos los tipos</option>
            {movementTypeOptions.filter(opt => opt.value !== "").map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
