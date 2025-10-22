import { ClipboardList } from 'lucide-react';
import { useTheme } from "@/shared/hooks/useTheme";
import type { StockMovementResponse, StockMovementType } from "../interfaces";

interface StockMovementsTableProps {
  movements: StockMovementResponse[];
  isLoading: boolean;
  searchTerm: string;
  typeFilter: StockMovementType | "";
}

/**
 * Tabla de movimientos de stock
 */
export const StockMovementsTable = ({
  movements,
  isLoading,
  searchTerm,
  typeFilter,
}: StockMovementsTableProps) => {
  const { colors, isDark } = useTheme();

  // Helper para obtener el color del tipo de movimiento
  const getTypeColor = (type: StockMovementType): string => {
    const colors = {
      Reabastecimiento: 'bg-gradient-to-r from-[#275081] to-[#F59E0B] text-white shadow-lg shadow-blue-500/50',
      Compra: 'bg-gradient-to-r from-[#275081] to-[#F59E0B] text-white shadow-lg shadow-blue-500/50',
      Venta: 'bg-gradient-to-r from-[#275081] to-[#F59E0B] text-white shadow-lg shadow-blue-500/50',
      Ajuste: 'bg-gradient-to-r from-[#275081] to-[#F59E0B] text-white shadow-lg shadow-blue-500/50',
      Devolucion: 'bg-gradient-to-r from-[#275081] to-[#F59E0B] text-white shadow-lg shadow-blue-500/50',
      Dañado: 'bg-gradient-to-r from-[#275081] to-[#F59E0B] text-white shadow-lg shadow-blue-500/50',
    };
    return colors[type];
  };

  // Helper para formatear fecha
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} overflow-hidden`}>
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className={`mt-4 ${colors.text.muted}`}>Cargando movimientos...</p>
        </div>
      </div>
    );
  }

  if (movements.length === 0) {
    return (
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} overflow-hidden`}>
        <div className="p-8 text-center">
          <ClipboardList className={`w-16 h-16 mx-auto ${colors.text.muted} opacity-50`} />
          <p className={`mt-4 text-lg ${colors.text.primary}`}>No se encontraron movimientos</p>
          <p className={`mt-2 ${colors.text.muted}`}>
            {searchTerm || typeFilter 
              ? "Intenta ajustar los filtros de búsqueda" 
              : "Aún no hay movimientos de stock registrados"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-100 to-gray-50'}`}>
            <tr>
              <th className={`px-6 py-4 text-center text-xs font-bold ${colors.text.primary} uppercase tracking-wider border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}>
                Referencia
              </th>
              <th className={`px-6 py-4 text-center text-xs font-bold ${colors.text.primary} uppercase tracking-wider border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}>
                Usuario
              </th>
              <th className={`px-6 py-4 text-center text-xs font-bold ${colors.text.primary} uppercase tracking-wider border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}>
                Tipo
              </th>
              <th className={`px-6 py-4 text-center text-xs font-bold ${colors.text.primary} uppercase tracking-wider border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}>
                Cantidad
              </th>
              <th className={`px-6 py-4 text-center text-xs font-bold ${colors.text.primary} uppercase tracking-wider border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}>
                Stock Anterior
              </th>
              <th className={`px-6 py-4 text-center text-xs font-bold ${colors.text.primary} uppercase tracking-wider border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}>
                Stock Nuevo
              </th>
              <th className={`px-6 py-4 text-center text-xs font-bold ${colors.text.primary} uppercase tracking-wider border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}>
                Razón
              </th>
              <th className={`px-6 py-4 text-center text-xs font-bold ${colors.text.primary} uppercase tracking-wider border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}>
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {movements.map((movement, index) => (
              <tr 
                key={movement.id} 
                className={`
                  ${index % 2 === 0 
                    ? isDark ? 'bg-gray-800/30' : 'bg-white' 
                    : isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'
                  }
                  hover:${isDark ? 'bg-gray-700/50' : 'bg-blue-50'} 
                  transition-all duration-200 ease-in-out
                  hover:shadow-md
                `}
              >
                {/* Referencia */}
                <td className={`px-6 py-4 text-center whitespace-nowrap`}>
                  <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>
                    {movement.reference}
                  </span>
                </td>

                {/* Usuario */}
                <td className={`px-6 py-4 text-center whitespace-nowrap`}>
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-semibold ${colors.text.primary}`}>
                      {movement.user?.username || 'N/A'}
                    </span>
                    {movement.user?.firstName && (
                      <span className={`text-xs ${colors.text.muted}`}>
                        {movement.user.firstName}
                      </span>
                    )}
                  </div>
                </td>

                {/* Tipo */}
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-lg ${getTypeColor(movement.type)}`}>
                    {movement.type}
                  </span>
                </td>

                {/* Cantidad */}
                <td className={`px-6 py-4 text-center whitespace-nowrap`}>
                  <span className={`text-sm font-bold ${movement.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </span>
                </td>

                {/* Stock Anterior */}
                <td className={`px-6 py-4 text-center whitespace-nowrap text-sm font-medium ${colors.text.muted}`}>
                  {movement.previousStock}
                </td>

                {/* Stock Nuevo */}
                <td className={`px-6 py-4 text-center whitespace-nowrap`}>
                  <span className={`text-sm font-bold ${colors.text.primary}`}>
                    {movement.newStock}
                  </span>
                </td>

                {/* Razón */}
                <td className={`px-6 py-4 text-center text-sm ${colors.text.muted} max-w-xs`}>
                  <div className="flex flex-col items-center">
                    <span className="line-clamp-1">{movement.reason}</span>
                    {movement.notes && (
                      <span className="text-xs italic mt-1 line-clamp-1 text-gray-500 dark:text-gray-400">
                        {movement.notes}
                      </span>
                    )}
                  </div>
                </td>

                {/* Fecha */}
                <td className={`px-6 py-4 text-center whitespace-nowrap text-sm ${colors.text.muted}`}>
                  {formatDate(movement.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
