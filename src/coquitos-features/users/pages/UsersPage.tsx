//* Librerias
import { Plus, Users } from "lucide-react";
import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/shallow";

//* Others
import { UserGrid, FormUserModal, UserStats, UserPagination } from "../components";
import { useUserStore } from "../store/user.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "../hooks/useDebounce";
import type { SearchUsersParams } from "../interfaces";
import { useAuthStore } from "@/auth/store/auth.store";
import { UnauthorizedUser } from "@/shared/pages";
import { useGetUsers } from "../hooks/useGetUsers";
import { useUsersStats } from "../hooks/useUsersStats";
import { userSearchSchema, type SearchUsersSchema } from "../schemas";
import { GenericSearchBar } from "@/shared/components";
import { usersSearchFilterOptions } from "../const";

const searchDefaultValues: SearchUsersSchema = {
  search: '',
  role: '',
  status: '',
};

/**
 * Página principal de gestión de usuarios
 * Implementa búsqueda, filtros, estadísticas y CRUD completo
 * Optimizado usando React Hook Form - Sin estados locales innecesarios
 */
export const UsersPage = () => {
  // * Paginacion ( necesarios)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  
  // * Estado para los filtros (controlado por el formulario)
  const [ searchFilters, setSearchFilters] = useState<SearchUsersSchema>(searchDefaultValues);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchFilters.search, 500);
  const debouncedRole = useDebounce(searchFilters.role, 500);
  const debouncedStatus = useDebounce(searchFilters.status, 500);

  // * Zustand Auth
  const user = useAuthStore(useShallow((state) => state.user));
  const { emailVerified, role, status } = user ?? {};

  // * Zustand User
  const modalMode = useUserStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useUserStore(useShallow((state) => state.setOpenModalCreate));
  const isMutating = useUserStore(useShallow((state) => state.isMutating));
  // * Theme
  const { colors, isDark } = useTheme();

  // * Tanstack Query - Hook de búsqueda con todos los filtros (memoizado para estabilidad)
  const currentParams: SearchUsersParams = useMemo(() => ({
    search: debouncedSearch,
    role: searchFilters.role,
    status: searchFilters.status,
    page,
    limit,
  }), [debouncedSearch, searchFilters.role, searchFilters.status, page, limit]);

  const { 
    users, 
    total, 
    page: currentPage, 
    limit: currentLimit, 
    totalPages, 
    nextPage, 
    previousPage, 
    isLoading,
    isFetching, // Necesario para detectar búsquedas activas
  } = useGetUsers(currentParams);

  // * Hook para estadísticas globales (todos los usuarios, no solo la página actual)
  const { stats } = useUsersStats({
    search: debouncedSearch,
    role: searchFilters.role,
    status: searchFilters.status,
  });

  // * Handler cuando cambian los filtros del buscador
  const handleSearchFiltersChange = useCallback((values: SearchUsersSchema) => {
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
  }, [debouncedSearch, searchFilters.role, searchFilters.status]);

  // * Detectar si hay cambios pendientes en la búsqueda (usuario escribiendo)
  const isSearchPending = searchFilters.search !== debouncedSearch || searchFilters.role !== debouncedRole || searchFilters.status !== debouncedStatus;

  // * Ref para rastrear si hay un fetch intencional (usuario busca/filtra)
  const isIntentionalFetchRef = useRef(false);

  // * ESTRATEGIA: Activar el flag cuando el usuario EMPIEZA a escribir o cambia filtros
  // Esto sucede ANTES del debounce, asegurando que el flag esté listo cuando el fetch inicie
  useEffect(() => {
    // Activar el flag si el usuario tiene algo escrito O cambió filtros de select
    const userIsSearching = searchFilters.search !== '' || searchFilters.role !== '' || searchFilters.status !== '';
    if (userIsSearching) {
      isIntentionalFetchRef.current = true;
    }
  }, [searchFilters.search, searchFilters.role, searchFilters.status]);

  // * Resetear el flag cuando el fetch termina exitosamente
  useEffect(() => {
    if (!isFetching && isIntentionalFetchRef.current) {
      // Resetear después de que el fetch complete
      const timer = setTimeout(() => {
        isIntentionalFetchRef.current = false;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  // * Loader para búsquedas/filtros: Solo se muestra para fetches INTENCIONALES
  const isSearching = isIntentionalFetchRef.current && isFetching && !isSearchPending && !isMutating;


  // * Validación de autorización
  if ((emailVerified && role === "Cajero") || status === "Inactivo" || status === "Suspendido") {
    return <UnauthorizedUser />;
  }

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
              Usuarios del Sistema
            </h3>
          </div>
                    
        </div>
        
        {/* Botones - Responsive */}
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                  
          {/* Botón agregar */}
          <button
            onClick={handleOpenModal}
            className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-2.5 xl:px-10 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-lg hover:shadow-xl transition-all duration-200 shadow-md cursor-pointer min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]`}
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-[#2309095c]" />
            <span className="text-[#08080865] font-semibold lg:font-bold text-sm lg:text-base ml-1.5 lg:ml-2">Agregar Usuario</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <UserStats {...stats} />

      {/* Search and Filters - Maneja su propio estado con React Hook Form */}
      <GenericSearchBar
        schema={userSearchSchema}
        defaultValues={searchDefaultValues}
        onSearchChange={handleSearchFiltersChange}
        selectFilters={usersSearchFilterOptions}
        searchPlaceholder="Buscar por nombre, email o teléfono..."
        searchLabel="Buscar Usuarios"
      />

      {/* Users Grid/Table */}
      {/* Loader se muestra cuando: carga inicial, mutaciones CRUD, o búsquedas activas */}
      <UserGrid users={users} isPending={isLoading || isMutating || isSearching} currentParams={currentParams} onPageEmpty={handlePageEmpty} />

      {/* Pagination */}
      {total > 0 && (
        <UserPagination
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
      {modalMode === 'create' && <FormUserModal currentParams={currentParams} onNewPageCreated={handlePageChange} />}
      {modalMode === 'update' && <FormUserModal currentParams={currentParams} onNewPageCreated={handlePageChange} />}
    </div>
  );
};