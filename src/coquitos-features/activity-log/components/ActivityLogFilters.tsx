import { Search, X } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface ActivityLogFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  action: string;
  setAction: (value: string) => void;
  entity: string;
  setEntity: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  onClearFilters: () => void;
}

export const ActivityLogFilters = ({
  search,
  setSearch,
  action,
  setAction,
  entity,
  setEntity,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClearFilters,
}: ActivityLogFiltersProps) => {
  const { isDark, colors } = useTheme();

  const inputClass = `px-4 py-2.5 rounded-lg border ${
    isDark
      ? "bg-[#0F172A] border-[#334155] focus:border-blue-500"
      : "bg-white border-gray-300 focus:border-[#275081]"
  } ${
    colors.text.primary
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all ${
    isDark ? "focus:ring-blue-500" : "focus:ring-[#275081]"
  }`;

  const labelClass = `block text-sm font-semibold ${colors.text.muted} mb-2`;

  return (
    <div
      className={`${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
      } rounded-xl p-6 shadow-sm border mb-6`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className={labelClass}>🔍 Buscar</label>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${colors.text.muted}`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en descripciones..."
              className={`${inputClass} pl-10 w-full`}
            />
          </div>
        </div>

        {/* Action Filter */}
        <div>
          <label className={labelClass}>Acción</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className={inputClass}
          >
            <option value="">Todas las acciones</option>
            <option value="CREATE">Crear</option>
            <option value="UPDATE">Actualizar</option>
            <option value="DELETE">Eliminar</option>
            <option value="LOGIN">Inicio de sesión</option>
            <option value="LOGOUT">Cierre de sesión</option>
          </select>
        </div>

        {/* Entity Filter */}
        <div>
          <label className={labelClass}>Entidad</label>
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className={inputClass}
          >
            <option value="">Todas las entidades</option>
            <option value="User">Usuarios</option>
            <option value="Product">Productos</option>
            <option value="Sale">Ventas</option>
            <option value="CashRegister">Caja</option>
            <option value="Category">Categorías</option>
            <option value="Customer">Clientes</option>
            <option value="ProductBatch">Lotes</option>
            <option value="System">Sistema</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start Date */}
        <div>
          <label className={labelClass}>Fecha Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* End Date */}
        <div>
          <label className={labelClass}>Fecha Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Clear Button */}
        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isDark
                ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            <X className="w-4 h-4" />
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
