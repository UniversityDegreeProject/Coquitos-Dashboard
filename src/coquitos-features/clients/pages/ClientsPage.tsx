import { useState, useCallback } from 'react';
import { Users, Plus } from 'lucide-react';
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import { useGetClients } from '../hooks';
import { useClientStore } from '../store/client.store';
import { ClientStats, ClientSearchPage, ClientGrid, FormClientModal } from '../components';
import type { ClientType } from '../interfaces';
import { useTheme } from "@/shared/hooks/useTheme";
import { useShallow } from "zustand/shallow";

/**
 * Página principal de gestión de clientes
 * Sigue el mismo patrón que ProductPage y CategoriesPage
 */
export const ClientsPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<ClientType | "">("");
  
  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // * Zustand - Optimizado con selectores específicos
  const modalMode = useClientStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useClientStore(useShallow((state) => state.setOpenModalCreate));
  
  // * TanStack Query
  const { clients, isLoading } = useGetClients();

  // * Theme
  const { colors, isDark } = useTheme();

  // * Filtrar clientes basado en los filtros
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      client.lastName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      client.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      client.phone.includes(debouncedSearch) ||
      client.address.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesType = !typeFilter || client.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // * Memoizar callbacks
  const handleOpenModal = useCallback(() => {
    setOpenModalCreate();
  }, [setOpenModalCreate]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleTypeChange = useCallback((value: ClientType | "") => {
    setTypeFilter(value);
  }, []);



  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <Users className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
            Gestión de Clientes
          </h3>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center px-6 py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5`}
        >
          <Plus className="w-5 h-5 mr-2 text-[#2309095c]" />
          <span className="text-[#08080865] font-bold">Agregar Cliente</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <ClientStats clients={filteredClients} />

      {/* Search and Filters */}
      <ClientSearchPage
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        typeFilter={typeFilter}
        onTypeChange={handleTypeChange}
      />

      {/* Clients Grid */}
      <ClientGrid 
        clients={filteredClients}
        isLoading={isLoading}
      />

      {/* Create Client Modal */}
      {modalMode === 'create' && (
        <FormClientModal />
      )}
      {/* Update Client Modal */}
      {modalMode === 'update' && (
        <FormClientModal />
      )}
    </div>
  );
};