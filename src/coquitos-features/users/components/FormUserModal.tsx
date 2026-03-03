// * Library
import { useForm, type SubmitHandler } from "react-hook-form";
import { X, User, Mail, Phone, Lock, Shield, UserCheck, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// * Others
import { LabelInputString, LabelPasswordInput, LabelSelect } from "@/shared/components";
import { useUserStore } from "../store/user.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { roleOptions, statusOptions } from "../const";
import { createUserSchema, type RegisterUserSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "../hooks/useCreateUser";
import { useShallow } from "zustand/shallow";
import { useUpdateUser } from "../hooks/useUpdateUser";
import type { SearchUsersParams } from "../interfaces";


const initialValues: RegisterUserSchema = {
  id: undefined,
  username: "",
  email: "",
  emailVerified: false,
  firstName: "",
  lastName: "",
  password: undefined,
  phone: "",
  role: "Administrador",
  status: "Activo",
};

interface FormUserModalProps {
  currentParams : SearchUsersParams;
  onNewPageCreated? : (newPage: number) => void;
}

export const FormUserModal = (props: FormUserModalProps) => {
  const { currentParams, onNewPageCreated } = props;
  // * React State
  const [showPasswordField, setShowPasswordField] = useState(false);
  
  // * Zustand
  const closeModal = useUserStore(useShallow((state) => state.closeModal));
  const modalMode = useUserStore(useShallow((state) => state.modalMode));
  const userToUpdate = useUserStore(useShallow((state) => state.userToUpdate));
  const setIsMutating = useUserStore(useShallow((state) => state.setIsMutating));
  
  // * Theme
  const { isDark } = useTheme();

  // * TanstackQuery
  const { useCreateUserMutation, isPending: isCreatingUser } = useCreateUser({ 
    currentParams, 
    onNewPageCreated,
    onSuccessCallback: closeModal,
    onFinally: () => setIsMutating(false)
  });
  const { updateUserMutation, isPending: isUpdatingUser } = useUpdateUser({ 
    currentParams,
    onSuccessCallback: closeModal,
    onFinally: () => setIsMutating(false)
  });
  // * Determinar si es modo editar
  const isEditMode = modalMode === 'update';
  
  // * React Hook Form
  const { control, setValue, handleSubmit, formState: { errors, isValid } } = useForm<RegisterUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const handleTogglePassword = () => {
    setShowPasswordField(!showPasswordField);
    if (showPasswordField) {
      setValue("password", undefined);
    }
  };

  const handleSubmitForm : SubmitHandler<RegisterUserSchema> = (data) => {
    // Cerrar modal y activar estado de mutación inmediatamente
    closeModal();
    setIsMutating(true);
    
    if (isEditMode) {
      updateUserMutation.mutate(data);
      return; 
    } 

    useCreateUserMutation.mutate(data);
  };

  // Effect to update the modal mode
  useEffect(() => {
    if (modalMode === 'update') {
      setValue('id', userToUpdate?.id || crypto.randomUUID());
      setValue('username', userToUpdate?.username || '');
      setValue('email', userToUpdate?.email || '');
      setValue('emailVerified', userToUpdate?.emailVerified || false);
      setValue('firstName', userToUpdate?.firstName || '');
      setValue('lastName', userToUpdate?.lastName || '');
      setValue('phone', userToUpdate?.phone || '');
      setValue('role', userToUpdate?.role || 'Administrador');
      setValue('status', userToUpdate?.status || 'Activo');
    }
  }, [modalMode, setValue, userToUpdate]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-[#1E293B]/95' : 'bg-white/95'} backdrop-blur-md rounded-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border ${isDark ? 'border-[#334155]/20' : 'border-white/20'}`}>
        {/* Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-[#1E293B]/80' : 'bg-white/80'} backdrop-blur-md p-4 border-b ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'} flex items-center justify-between rounded-t-2xl`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
              <User className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
              {isEditMode ? 'Editar Usuario' : 'Agregar Usuario'}
            </h2>
          </div>
          <button
            onClick={() => closeModal()}
            className={`p-2 ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg transition-all duration-200 cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="p-4 space-y-4">
          {/* Primera fila - Usuario y Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LabelInputString 
              label="Usuario" 
              name="username" 
              control={control}
              icon={User}
              required
              error={errors.username?.message}
            />
            <LabelInputString
              label="Correo Electrónico"
              name="email"
              control={control}
              icon={Mail}
              required
              error={errors.email?.message}
            />
          </div>

          {/* Segunda fila - Nombres y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LabelInputString 
              label="Nombres" 
              name="firstName" 
              control={control}
              icon={User}
              required
              error={errors.firstName?.message}
            />
            <LabelInputString 
              label="Apellidos" 
              name="lastName" 
              control={control}
              icon={User}
              required
              error={errors.lastName?.message}
            />
          </div>

          {/* Tercera fila - Teléfono y Rol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LabelInputString 
              label="Teléfono" 
              name="phone" 
              control={control}
              icon={Phone}
              required
              error={errors.phone?.message}
            />
            <LabelSelect
              label="Rol"
              name="role"
              control={control}
              options={roleOptions}
              icon={Shield}
              placeholder="Selecciona un rol"
              required
              error={errors.role?.message}
            />
          </div>

          {/* Cuarta fila - Estado y Contraseña (solo en modo crear) */}
          <div className={`grid grid-cols-1 ${isEditMode ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-3`}>
            <LabelSelect
              label="Estado"
              name="status"
              control={control}
              options={statusOptions}
              icon={UserCheck}
              placeholder="Selecciona un estado"
              required
              error={errors.status?.message}
            />
            
            {/* Desplegable de Contraseña - Solo en modo crear */}
            {!isEditMode && (
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                  Contraseña
                </label>
                <div className={`border ${isDark ? 'border-[#334155]' : 'border-gray-200'} rounded-lg overflow-hidden transition-all duration-300`}>
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className={`w-full p-3 flex items-center justify-between ${isDark ? 'bg-[#0F172A]/50 hover:bg-[#0F172A]/80' : 'bg-gray-50 hover:bg-gray-100'} transition-all duration-200`}
                  >
                    <div className="flex items-center space-x-2">
                      <Lock className={`w-4 h-4 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                      <span className={`text-sm ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                        {showPasswordField ? 'Personalizada' : 'Autogenerada'}
                      </span>
                    </div>
                    {showPasswordField ? (
                      <ChevronUp className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
                    )}
                  </button>
                  
                  {/* Campo de contraseña colapsable */}
                  <div className={`transition-all duration-300 ease-in-out ${showPasswordField ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {showPasswordField && (
                      <div className={`p-3 border-t ${isDark ? 'border-[#334155] bg-[#0F172A]/30' : 'border-gray-200 bg-white'}`}>
                        <LabelPasswordInput
                          label=""
                          name="password"
                          control={control}
                          icon={Lock}
                          required={false}
                          placeholder="Contraseña personalizada"
                          error={errors.password?.message}
                        />
                        {/* Información de requisitos de contraseña */}
                        <div className="mt-2 text-xs text-gray-500">
                          <p className="font-medium text-gray-600">La contraseña debe contener:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Al menos 6 caracteres</li>
                            <li>Una letra mayúscula (A-Z)</li>
                            <li>Una letra minúscula (a-z)</li>
                            <li>Un número (0-9)</li>
                            <li>Un carácter especial (@$!%*?&)</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'}`}>
            <button
              type="button"
              onClick={() => closeModal()}
              className={`flex-1 px-4 py-2.5 border ${isDark ? 'border-[#334155] text-[#E2E8F0] hover:bg-[#334155]/50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-all duration-200 font-medium text-sm cursor-pointer`}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isCreatingUser || isUpdatingUser || !isValid}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${isDark ? 'from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90' : 'from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90'} text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2`}
            >
              {isCreatingUser && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdatingUser && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCreatingUser || isUpdatingUser ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Usuario' : 'Registrar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
