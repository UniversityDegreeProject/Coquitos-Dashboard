//* Librerias
import { Plus, Users, Shield } from "lucide-react";
import { useCallback } from "react";

//* Others
import { SearchPage } from "@/shared/pages";
import { LabelInputString, LabelSelect } from "@/shared/components";
import { useForm } from "react-hook-form";
import { UserGrid } from "../components";
import { useGetUsers } from "../hooks/useGetUsers";
import { useUserStore } from "../store/user.store";
import { FormUserModal } from "../components";
import { useTheme } from "@/shared/hooks/useTheme";
import type { User } from "../interfaces";
import { useShallow } from "zustand/shallow";
import { roleOptions } from "../const/role-options";
import { statusOptions } from "../const/status-options";

const initialValue : User[] = [];

export const UsersPage = () => {


  // *Zustand - Optimizado con selectores específicos
  const modalMode = useUserStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useUserStore(useShallow((state) => state.setOpenModalCreate));
  
  // * HooksTanstack
  const { data : users = initialValue, isPending } = useGetUsers();
  
  // * Theme
  const { colors, isDark } = useTheme();
  
  // * React Hook Form
  const { control } = useForm({
    defaultValues: {
      search: "",
      roleFilter: "",
      statusFilter: "",
    },
    mode: "onChange",
  });

  // * Memoizar el callback del botón
  const handleOpenModal = useCallback(() => {
    setOpenModalCreate();
  }, [setOpenModalCreate]);




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

      {/* Search and Filters */}
      <SearchPage
        roleFilter={
          <LabelSelect
            label="Filtrar por Rol"
            name="roleFilter"
            control={control}
            options={roleOptions}
            icon={Shield}
            className="mb-0"
          />
        }
        statusFilter={
          <LabelSelect
            label="Filtrar por Estado"
            name="statusFilter"
            control={control}
            options={statusOptions}
            icon={Users}
            className="mb-0"
          />
        }
      >
        <LabelInputString
          label="Buscar usuarios..."
          name="search"
          control={control}
          placeholder="Buscar usuarios..."
        />
      </SearchPage>

      {/* Users Table */}
      <UserGrid users={users} isPending={isPending} />

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
