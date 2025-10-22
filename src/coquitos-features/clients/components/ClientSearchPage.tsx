import { useState, useMemo } from 'react';
import { Search, Filter, UserPlus } from 'lucide-react';
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import { ClientGrid } from './ClientGrid';
import { documentTypeOptions, statusOptions } from '../const';
import type { ClientResponse } from '../interfaces';

interface ClientSearchPageProps {
  clients: ClientResponse[];
  isLoading: boolean;
  onEdit?: (client: ClientResponse) => void;
  onDelete?: (client: ClientResponse) => void;
  onAdd?: () => void;
}

/**
 * Página de búsqueda y filtrado de clientes
 */
export const ClientSearchPage = ({
  clients,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
}: ClientSearchPageProps) => {
  const { colors, isDark } = useTheme();
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Activo' | 'Inactivo' | ''>('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState<'CI' | 'NIT' | 'PASSPORT' | ''>('');
  
  // Debounce para la búsqueda
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // Filtrar clientes
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        client.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        client.phone.includes(debouncedSearch) ||
        client.documentNumber.includes(debouncedSearch) ||
        (client.address && client.address.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      const matchesStatus = !statusFilter || client.status === statusFilter;
      const matchesDocumentType = !documentTypeFilter || client.documentType === documentTypeFilter;
      
      return matchesSearch && matchesStatus && matchesDocumentType;
    });
  }, [clients, debouncedSearch, statusFilter, documentTypeFilter]);

  return (
    <div className="space-y-6">
      {/* Header con botón de agregar */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${colors.text.primary}`}>
          Gestión de Clientes
        </h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Agregar Cliente
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-6 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.text.muted}`} />
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-[#334155]' : 'border-gray-300'} ${isDark ? 'bg-[#0F172A]' : 'bg-white'} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Filtro por estado */}
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.text.muted}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'Activo' | 'Inactivo' | '')}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-[#334155]' : 'border-gray-300'} ${isDark ? 'bg-[#0F172A]' : 'bg-white'} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por tipo de documento */}
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.text.muted}`} />
            <select
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value as 'CI' | 'NIT' | 'PASSPORT' | '')}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-[#334155]' : 'border-gray-300'} ${isDark ? 'bg-[#0F172A]' : 'bg-white'} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {documentTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <p className={`text-sm ${colors.text.muted}`}>Total Clientes</p>
          <p className={`text-2xl font-bold ${colors.text.primary}`}>
            {filteredClients.length}
          </p>
        </div>
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <p className={`text-sm ${colors.text.muted}`}>Clientes Activos</p>
          <p className={`text-2xl font-bold text-green-600 dark:text-green-400`}>
            {filteredClients.filter(c => c.status === 'Activo').length}
          </p>
        </div>
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <p className={`text-sm ${colors.text.muted}`}>Clientes Inactivos</p>
          <p className={`text-2xl font-bold text-red-600 dark:text-red-400`}>
            {filteredClients.filter(c => c.status === 'Inactivo').length}
          </p>
        </div>
      </div>

      {/* Grid de clientes */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className={`mt-4 ${colors.text.muted}`}>Cargando clientes...</p>
        </div>
      ) : (
        <ClientGrid
          clients={filteredClients}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};