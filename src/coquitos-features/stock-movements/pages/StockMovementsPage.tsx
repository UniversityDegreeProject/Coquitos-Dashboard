import { useState, useCallback, useMemo } from 'react';
import { ClipboardList, ArrowLeft, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import { useGetStockMovements } from "../hooks";
import { movementTypeOptions } from "../const/movement-types";
import type { StockMovementType } from "../interfaces";
import { paths } from "@/router/paths";

/**
 * Página de listado de todos los movimientos de stock
 * Muestra el historial completo con búsqueda y filtros
 */
export const StockMovementsPage = () => {
  const navigate = useNavigate();
  
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<StockMovementType | "">("");

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // * TanStack Query
  const { stockMovements, isLoading } = useGetStockMovements();

  // * Theme
  const { colors, isDark } = useTheme();

  // * Filtrar movimientos basado en los filtros
  const filteredMovements = useMemo(() => {
    return stockMovements.filter(movement => {
      const matchesSearch = 
        movement.reference?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        movement.reason?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        movement.notes?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesType = !typeFilter || movement.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [stockMovements, debouncedSearch, typeFilter]);

  // * Callback para volver a productos
  const handleGoBack = useCallback(() => {
    navigate(paths.dashboard.products);
  }, [navigate]);

  // * Helper para obtener el color del tipo de movimiento
  const getTypeColor = (type: StockMovementType): string => {
    const colors = {
      Reabastecimiento: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      Compra: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      Venta: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      Ajuste: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      Devolucion: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      Dañado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[type];
  };

  // * Helper para formatear fecha
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGoBack}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
          >
            <ArrowLeft className={`w-5 h-5 ${colors.text.primary}`} />
          </button>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <ClipboardList className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
            Historial de Movimientos de Stock
          </h3>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <p className={`text-sm ${colors.text.muted}`}>Total Movimientos</p>
          <p className={`text-2xl font-bold ${colors.text.primary}`}>
            {filteredMovements.length}
          </p>
        </div>
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <p className={`text-sm ${colors.text.muted}`}>Reabastecimientos</p>
          <p className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>
            {filteredMovements.filter(m => m.type === 'Reabastecimiento').length}
          </p>
        </div>
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <p className={`text-sm ${colors.text.muted}`}>Ventas</p>
          <p className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>
            {filteredMovements.filter(m => m.type === 'Venta').length}
          </p>
        </div>
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <p className={`text-sm ${colors.text.muted}`}>Ajustes</p>
          <p className={`text-2xl font-bold text-yellow-600 dark:text-yellow-400`}>
            {filteredMovements.filter(m => m.type === 'Ajuste').length}
          </p>
        </div>
      </div>

      {/* Búsqueda y Filtros */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-6 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.text.muted}`} />
            <input
              type="text"
              placeholder="Buscar por referencia, razón o notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-[#334155]' : 'border-gray-300'} ${isDark ? 'bg-[#0F172A]' : 'bg-white'} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Filtro por tipo */}
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.text.muted}`} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as StockMovementType | "")}
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

      {/* Tabla de movimientos */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} overflow-hidden`}>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className={`mt-4 ${colors.text.muted}`}>Cargando movimientos...</p>
          </div>
        ) : filteredMovements.length === 0 ? (
          <div className="p-8 text-center">
            <ClipboardList className={`w-16 h-16 mx-auto ${colors.text.muted} opacity-50`} />
            <p className={`mt-4 text-lg ${colors.text.primary}`}>No se encontraron movimientos</p>
            <p className={`mt-2 ${colors.text.muted}`}>
              {searchTerm || typeFilter 
                ? "Intenta ajustar los filtros de búsqueda" 
                : "Aún no hay movimientos de stock registrados"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                    Referencia
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                    Tipo
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                    Cantidad
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                    Stock Anterior
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                    Stock Nuevo
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                    Razón
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMovements.map((movement) => (
                  <tr 
                    key={movement.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${colors.text.primary}`}>
                      {movement.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(movement.type)}`}>
                        {movement.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${colors.text.primary}`}>
                      <span className={movement.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${colors.text.muted}`}>
                      {movement.previousStock}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${colors.text.primary}`}>
                      {movement.newStock}
                    </td>
                    <td className={`px-6 py-4 text-sm ${colors.text.muted} max-w-xs truncate`}>
                      {movement.reason}
                      {movement.notes && (
                        <span className="block text-xs italic mt-1">{movement.notes}</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${colors.text.muted}`}>
                      {formatDate(movement.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

