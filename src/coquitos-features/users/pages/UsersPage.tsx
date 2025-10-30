//* Librerias
import { Plus, Users } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";

//* Others
import { UserGrid, UserSearchPage, FormUserModal, UserStats } from "../components";
import { useUserSearch } from "../hooks/useSearchUsers";
import { useUserStore } from "../store/user.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "../hooks/useDebounce";
import { validateVerifiedUsers } from "../helpers";
import type { Role, Status, UserResponse } from "../interfaces";
import { useAuthStore } from "@/auth/store/auth.store";
import { UnauthorizedUser } from "@/shared/pages";

/**
 * Página principal de gestión de usuarios
 * Implementa búsqueda, filtros, estadísticas y CRUD completo
 * Optimizado con memoización (useCallback, useMemo, memo) para máxima performance
 */
export const UsersPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // *Zustand Auth
  const user = useAuthStore(useShallow((state) => state.user))  ;

  const {emailVerified, role, status } = user as UserResponse;


  // *Zustand User - Optimizado con selectores específicos
  const modalMode = useUserStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useUserStore(useShallow((state) => state.setOpenModalCreate));
  const usersInPolling = useUserStore(useShallow((state) => state.usersInPolling));
  const removeUserFromPolling = useUserStore(useShallow((state) => state.removeUserFromPolling));
  
  // * Hook de búsqueda con todos los filtros
  const { users, isLoading } = useUserSearch({
    search: debouncedSearch,
    role: roleFilter,
    status: statusFilter,
  });
  
  // * Theme
  const { colors, isDark } = useTheme();
  
  // * Memoizar callbacks para evitar re-renders innecesarios
  const handleOpenModal = useCallback(() => {
    setOpenModalCreate();
  }, [setOpenModalCreate]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleRoleChange = useCallback((value: Role | "") => {
    setRoleFilter(value);
  }, []);

  const handleStatusChange = useCallback((value: Status | "") => {
    setStatusFilter(value);
  }, []);

  // * Validar usuarios verificados en cada re-render
  useEffect(() => {
    if (users.length > 0 && usersInPolling.size > 0) {
      validateVerifiedUsers(users, usersInPolling, removeUserFromPolling);
    }
  }, [users, usersInPolling, removeUserFromPolling]);


  if( (emailVerified && role === "Cajero") || status === "Inactivo" || status === "Suspendido") {
    return <UnauthorizedUser />;
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <Users className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
            Usuarios del Sistema
          </h3>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center px-6 py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5`}
        >
          <Plus className="w-5 h-5 mr-2 text-[#2309095c]" />
          <span className="text-[#08080865] font-bold">Agregar Usuario</span>
        </button>
      </div>

      {/* Statistics */}
      <UserStats users={users} />

      {/* Search and Filters */}
      <UserSearchPage 
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        roleFilter={roleFilter}
        onRoleChange={handleRoleChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {/* Users Grid/Table */}
      <UserGrid users={users} isPending={isLoading} />

      {/* Create User Modal */}
      {modalMode === 'create' && (
        <FormUserModal />
      )}
      {/* Update User Modal */}
      {modalMode === 'update' && (
        <FormUserModal />
      )}
    </div>
  );
};
