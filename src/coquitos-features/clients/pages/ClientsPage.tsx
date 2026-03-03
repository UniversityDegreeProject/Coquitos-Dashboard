//* Librerias
import { Plus, Users } from "lucide-react";
import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import type { SearchClientsParams } from "../interfaces";
import { useClientsStats, useDebounce, useGetClients } from "../hooks";
import { useClientStore } from "../store/client.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { searchClientsSchema, type SearchClientsSchema } from "../schemas";
import { ClientGrid, ClientPagination, ClientStats, FormClientModal } from "../components";
import { clientsSearchFilterOptions } from "../const";
import { GenericSearchBar } from "@/shared/components";

//* Others

const searchDefaultValues: SearchClientsSchema = {
  search: '',
  type: '',
};
/**
 * Página principal de gestión de clientes
 * Implementa búsqueda, filtros, estadísticas y CRUD completo
 * Optimizado usando React Hook Form - Sin estados locales innecesarios
 */
export const ClientsPage = () => {
  // * Paginacion ( necesarios)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  
  // * Estado para los filtros (controlado por el formulario)
  const [ searchFilters, setSearchFilters] = useState<SearchClientsSchema>(searchDefaultValues);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchFilters.search, 500);
  const debouncedType = useDebounce(searchFilters.type, 500);



  // * Zustand Clients
  const modalMode = useClientStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useClientStore(useShallow((state) => state.setOpenModalCreate));
  const isMutating = useClientStore(useShallow((state) => state.isMutation));

  // * Theme
  const { colors, isDark } = useTheme();

  // * Tanstack Query - Hook de búsqueda con todos los filtros
  const currentParams: SearchClientsParams = {
    search: debouncedSearch,
    type: searchFilters.type,
    page,
    limit,
  };

  const { 
    clients, 
    total, 
    page: currentPage, 
    limit: currentLimit, 
    totalPages, 
    nextPage, 
    previousPage, 
    isLoading, 
    isFetching,
  } = useGetClients(currentParams);

  // * Hook para estadísticas globales (todos los usuarios, no solo la página actual)
  const { stats } = useClientsStats({
    search : debouncedSearch,
    type : searchFilters.type,
  });

  // * Handler cuando cambian los filtros del buscador
  const handleSearchFiltersChange = useCallback((values: SearchClientsSchema) => {
    setSearchFilters(values);
  }, []);

  // * Callback cuando una página queda vacía después de eliminar
  const handlePageEmpty = useCallback(() => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // * Memoizar callbacks
  const handleOpenModal = useCallback(() => {
    setOpenModalCreate();
  }, [setOpenModalCreate]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  // * Resetear página cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, searchFilters.type]);
  

  // * El usuario esta escribiendo en el buscador
  const isSearchPending =  searchFilters.search !== debouncedSearch || searchFilters.type !== debouncedType;
  // * Ref para rastrear si hay un fetch intencional (usuario busca/filtra)
  const isIntentionalFetchByUser = useRef<boolean>(false);

  // * ESTRATEGIA: Activar el flag cuando el usuario EMPIEZA a escribir o cambia filtros
  useEffect(() => {
    const searchHasBeenChange : boolean = searchFilters.search !== '' || searchFilters.type !== '';

    if (searchHasBeenChange) {
      isIntentionalFetchByUser.current = true;
    }
  }, [searchFilters.search, searchFilters.type]);

  useEffect(() => {
    if (!isFetching && isIntentionalFetchByUser.current) {
      const timer = setTimeout(() => {
        isIntentionalFetchByUser.current = false;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isFetching, isIntentionalFetchByUser]);

  const isSearching = useMemo(() =>{
    return  isIntentionalFetchByUser.current && isFetching && !isSearchPending && !isMutating;
  }, [isFetching, isSearchPending, isMutating]); 
  

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Título con icono y toggle tema */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
              <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
            <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold ${colors.text.primary}`}>
              Clientes del Sistema
            </h3>
          </div>
        </div>
        
        {/* Botones - Responsive */}
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                   
          {/* Botón agregar */}
          <button
            onClick={handleOpenModal}
            className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-2.5 xl:px-10 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-lg hover:shadow-md transition-all duration-200 shadow-md cursor-pointer min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]`}
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-[#2309095c]" />
            <span className="text-[#08080865] font-semibold lg:font-bold text-sm lg:text-base ml-1.5 lg:ml-2">Agregar Cliente</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <ClientStats {...stats} />

      {/* Search and Filters - Maneja su propio estado con React Hook Form */}
      <GenericSearchBar
        schema={searchClientsSchema}
        defaultValues={searchDefaultValues}
        onSearchChange={handleSearchFiltersChange}
        selectFilters={clientsSearchFilterOptions}
        searchPlaceholder="Buscar por nombre, email o teléfono..."
        searchLabel="Buscar Clientes"
      />

      {/* Clients Grid/Table */}
      {/* Solo mostrar loader en: carga inicial (isLoading) o mutaciones CRUD (isMutating) */}
      {/* El refetch automático cada 3s NO debe mostrar loader */}
      <ClientGrid clients={clients} isPending={isLoading || isMutating || isSearching} currentParams={currentParams} onPageEmpty={handlePageEmpty} />

      {/* Pagination */}
      {total > 0 && (
        <ClientPagination
          paginationData={{ 
            total, 
            page: currentPage, 
            limit: currentLimit, 
            totalPages, 
            nextPage, 
            previousPage 
          }}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          currentLimit={limit}
          isLoading={isLoading}
        />
      )}

      {/* Modals */}
      {modalMode === 'create' && <FormClientModal currentParams={currentParams} onNewPageCreated={handlePageChange} />}
      {modalMode === 'update' && <FormClientModal currentParams={currentParams} onNewPageCreated={handlePageChange} />}
    </div>
  );
};