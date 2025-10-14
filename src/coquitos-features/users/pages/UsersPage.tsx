//* Librerias
import { Plus } from "lucide-react";

//* Others
import { SearchPage } from "@/shared/pages";
import { LabelInputString } from "@/shared/components";
import { useForm } from "react-hook-form";
import { UserGrid } from "../components";
import { useGetUsers } from "../hooks/useGetUsers";
import { useUserStore } from "../store/user.store";
import { FormUserModal } from "../components";

export const UsersPage = () => {
  // *Zustand
  const modalMode = useUserStore(state => state.modalMode);
  const setOpenModalCreateUser = useUserStore(state => state.setOpenModalCreateUser);
  // * HooksTanstack
  const { data: users = [] } = useGetUsers();
  // * React Hook Form
  const {control,formState: { errors } } = useForm<any>({
    // resolver: zodResolver(loginUserSchema),
  });




  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          Usuarios del Sistema
        </h3>
        <button
          onClick={() => setOpenModalCreateUser()}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Usuario
        </button>
      </div>

      {/* Search */}
      <SearchPage
        children={
          <LabelInputString
            label="Buscar usuarios..."
            name="search"
            control={control}
            // error={errors.search?.message}
            placeholder="Buscar usuarios..."
          />
        }
      />

      {/* Users Table */}
      <UserGrid users={users} />

      {/* Create User Modal */}
      {modalMode === 'create' && (
        <FormUserModal />
      )}
    </div>
  );
};
