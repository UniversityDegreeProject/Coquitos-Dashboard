//* Librerias
import { Plus, Users } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
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
  // * Estados de paginación (solo estos son necesarios)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  
  // * Estado para los filtros (controlado por el formulario)
  const [searchFilters, setSearchFilters] = useState<SearchUsersSchema>(searchDefaultValues);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchFilters.search, 500);

  // * Zustand Auth
  const user = useAuthStore(useShallow((state) => state.user));
  const { emailVerified, role, status } = user ?? {};

  // * Zustand User
  const modalMode = useUserStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useUserStore(useShallow((state) => state.setOpenModalCreate));

  // * Theme
  const { colors, isDark } = useTheme();

  // * Tanstack Query - Hook de búsqueda con todos los filtros
  const { 
    users, 
    total, 
    page: currentPage, 
    limit: currentLimit, 
    totalPages, 
    nextPage, 
    previousPage, 
    isLoading, 
    isFetching 
  } = useGetUsers({
    search: debouncedSearch,
    role: searchFilters.role,
    status: searchFilters.status,
    page,
    limit,
  } as SearchUsersParams);

  // * Resetear página cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, searchFilters.role, searchFilters.status]);

  // * Handler cuando cambian los filtros del buscador
  const handleSearchFiltersChange = useCallback((values: SearchUsersSchema) => {
    setSearchFilters(values);
  }, []);

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

  // * Validación de autorización
  if ((emailVerified && role === "Cajero") || status === "Inactivo" || status === "Suspendido") {
    return <UnauthorizedUser />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <Users className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold ${colors.text.primary}`}>
            Usuarios del Sistema
          </h3>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto`}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#2309095c]" />
          <span className="text-sm sm:text-base text-[#08080865] font-bold">Agregar Usuario</span>
        </button>
      </div>

      {/* Statistics */}
      <UserStats users={users} />

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
      <UserGrid users={users} isPending={isFetching || isLoading} />

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
          isLoading={isFetching || isLoading}
        />
      )}

      {/* Modals */}
      {modalMode === 'create' && <FormUserModal />}
      {modalMode === 'update' && <FormUserModal />}
    </div>
  );
};