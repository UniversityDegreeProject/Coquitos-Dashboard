import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ClientCard } from "./ClientCard";
import type { Client } from "../interfaces";

interface ClientGridProps {
  clients: Client[];
  isLoading?: boolean;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  viewMode?: 'grid' | 'list';
}

/**
 * Grid responsivo para mostrar clientes
 * Soporta vista de grid y lista con estado de carga
 */
export const ClientGrid = memo(({ 
  clients, 
  isLoading = false, 
  onEdit, 
  onDelete,
  viewMode = 'grid'
}: ClientGridProps) => {
  const { isDark } = useTheme();

  if (isLoading) {
    return (
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {[...Array(6)].map((_, index) => (
          viewMode === 'grid' ? (
            <div
              key={index}
              className={`animate-pulse rounded-xl shadow-lg ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}
            >
              <div className="p-6">
                {/* Avatar y header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  </div>
                </div>
                
                {/* Nombre y documento */}
                <div className="mb-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
                
                {/* Badges */}
                <div className="flex space-x-2 mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                </div>
                
                {/* Información de contacto */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
                
                {/* Estadísticas */}
                <div className="pt-4 border-t border-gray-200 dark:border-[#334155]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded" />
                    </div>
                    <div className="text-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={index}
              className={`animate-pulse rounded-xl shadow-lg ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-4`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-12 text-center`}>
        <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${isDark ? 'bg-[#0F172A]' : 'bg-gray-100'} flex items-center justify-center`}>
          <svg className={`w-12 h-12 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
          No hay clientes registrados
        </h3>
        <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Comienza agregando tu primer cliente
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-4 hover:shadow-xl transition-all duration-200`}
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDark ? 'border-[#1E293B]' : 'border-white'} ${client.status === 'Activo' ? 'bg-green-500' : client.status === 'Bloqueado' ? 'bg-red-500' : 'bg-gray-400'}`} />
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                    {client.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    client.clientType === 'Cliente VIP' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    client.clientType === 'Empresa' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {client.clientType === 'Cliente VIP' ? '👑' : client.clientType === 'Empresa' ? '🏢' : '⭐'}
                    <span className="ml-1">{client.clientType}</span>
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} mb-1`}>
                  {client.documentType || 'CC'}: {client.document}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                    📞 {client.phone}
                  </span>
                  {client.email && (
                    <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                      ✉️ {client.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="text-right">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>Órdenes</p>
                    <p className={`font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                      {client.totalOrders || 0}
                    </p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>Total</p>
                    <p className="font-semibold text-green-600">
                      ${client.totalSpent ? new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(client.totalSpent) : '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(client)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
                    aria-label="Editar cliente"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(client)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                    aria-label="Eliminar cliente"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});
