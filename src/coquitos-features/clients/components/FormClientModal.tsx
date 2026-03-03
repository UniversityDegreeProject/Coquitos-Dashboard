import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, Mail, Phone, MapPin, Users, Loader2 } from 'lucide-react';
import { useTheme } from "@/shared/hooks/useTheme";
import { useClientStore } from '../store/client.store';
import { useCreateClient, useUpdateClient } from '../hooks';
import { createClientSchema, type CreateClientFormData } from '../schemas';
import { typesOptions } from '../const';
import { useEffect } from 'react';
import type { SearchClientsParams } from '../interfaces';
import { useShallow } from 'zustand/react/shallow';
import { LabelInputString, LabelSelect, LabelTextarea } from '@/shared/components';

/**
 * Modal para crear/editar cliente
 */

const initialValues : CreateClientFormData = {
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  type: 'Regular',
}


interface FormClientModalProps {
  currentParams : SearchClientsParams;
  onNewPageCreated? : (newPage: number) => void;
}

export const FormClientModal = (props: FormClientModalProps) => {
  const { currentParams, onNewPageCreated } = props;
  const { isDark } = useTheme();

  // * Zustand
  const setIsMutating = useClientStore(useShallow((state) => state.setIsMutation));
  const closeModal = useClientStore(useShallow((state) => state.closeModal));
  const modalMode = useClientStore(useShallow((state) => state.modalMode));
  const clientToUpdate = useClientStore(useShallow((state) => state.clientToUpdate));

  // * TanstackQuery
  const { useCreateClientMutation, isPending: isCreatingClient } = useCreateClient({
    currentParams,
    onNewPageCreated,
    onSuccessCallback: closeModal,
    onFinally: () => setIsMutating(false)
  });

  const { updateClientMutation, isPending: isUpdatingClient } = useUpdateClient({
    currentParams,
    onSuccessCallback: closeModal,
    onFinally: () => setIsMutating(false)
  });

  // * Determinar si es modo editar
  const isUpdateMode = modalMode === 'update';

  // * React Hook Form
  const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Handler para submit
  const onSubmit : SubmitHandler<CreateClientFormData> = async ( data ) => {
    closeModal();
    setIsMutating(true);

    if (isUpdateMode) {
      updateClientMutation.mutate(data);
      return;
    }


    useCreateClientMutation.mutate(data);
  };



  useEffect(() => {
    if (modalMode === 'update') {
      setValue('id', clientToUpdate?.id || '');
      setValue('firstName', clientToUpdate?.firstName || '');
      setValue('lastName', clientToUpdate?.lastName || '');
      setValue('email', clientToUpdate?.email || '');
      setValue('phone', clientToUpdate?.phone || '');
      setValue('address', clientToUpdate?.address || '');
      setValue('type', clientToUpdate?.type || 'Regular');
    }
  }, [modalMode, setValue, clientToUpdate]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-[#1E293B]/95' : 'bg-white/95'} backdrop-blur-md rounded-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border ${isDark ? 'border-[#334155]/20' : 'border-white/20'}`}>
        {/* Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-[#1E293B]/80' : 'bg-white/80'} backdrop-blur-md p-4 border-b ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'} flex items-center justify-between rounded-t-2xl`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
              <Users className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
              {isUpdateMode ? 'Editar Cliente' : 'Agregar Cliente'}
            </h2>
          </div>
          <button
            onClick={() => closeModal()}
            className={`p-2 ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg transition-all duration-200 cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Primera fila - Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LabelInputString 
              label="Nombre" 
              name="firstName" 
              control={control}
              icon={User}
              placeholder="Ej: Juan"
              required
              error={errors.firstName?.message}
            />
            <LabelInputString
              label="Apellido"
              name="lastName"
              control={control}
              icon={User}
              placeholder="Ej: Pérez"
              required
              error={errors.lastName?.message}
            />
          </div>

          {/* Segunda fila - Email y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LabelInputString 
              label="Email" 
              name="email" 
              control={control}
              icon={Mail}
              placeholder="ejemplo@correo.com"
              required
              error={errors.email?.message}
            />
            <LabelInputString 
              label="Teléfono" 
              name="phone" 
              control={control}
              icon={Phone}
              placeholder="Ej: 71234567"
              required
              error={errors.phone?.message}
            />
          </div>

          {/* Tercera fila - Dirección */}
          <LabelTextarea
            label="Dirección"
            name="address"
            control={control}
            icon={MapPin}
            placeholder="Ej: Av. Principal #123, Zona Centro"
            rows={3}
            required
            error={errors.address?.message}
          />

          {/* Cuarta fila - Tipo de Cliente */}
          <LabelSelect
            label="Tipo de Cliente"
            name="type"
            control={control}
            options={typesOptions.filter(opt => opt.value !== '')}
            icon={Users}
            placeholder="Selecciona un tipo"
            required
            error={errors.type?.message}
          />

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
              disabled={isCreatingClient || isUpdatingClient || !isValid}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${isDark ? 'from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90' : 'from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90'} text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2`}
            >
              {(isCreatingClient || isUpdatingClient) && <Loader2 className="w-4 h-4 animate-spin" />}
              {(isCreatingClient || isUpdatingClient) ? (isUpdateMode ? 'Actualizando...' : 'Creando...') : (isUpdateMode ? 'Actualizar Cliente' : 'Registrar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
