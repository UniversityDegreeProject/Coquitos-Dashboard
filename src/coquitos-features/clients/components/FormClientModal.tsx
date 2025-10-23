import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useTheme } from "@/shared/hooks/useTheme";
import { useClientStore } from '../store/client.store';
import { useCreateClient, useUpdateClient } from '../hooks';
import { createClientSchema, type CreateClientFormData } from '../schemas';
import { clientTypeOptions } from '../const';
import { useEffect } from 'react';

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
export const FormClientModal = () => {
  const { colors, isDark } = useTheme();

  // * Zustand
  const { modalMode, clientToUpdate, closeModal } = useClientStore();

  // * TanstackQuery
  const { useCreateClientMutation } = useCreateClient();
  const { updateClientMutation } = useUpdateClient();

  // * Determinar si es modo editar
  const isUpdateMode = modalMode === 'update';

  // * React Hook Form
  const {  register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Handler para submit
  const onSubmit : SubmitHandler<CreateClientFormData> = async ( data ) => {
    closeModal();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`
        relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
        ${isDark ? 'bg-[#1E293B]' : 'bg-white'}
        rounded-2xl shadow-2xl
        border ${isDark ? 'border-[#334155]' : 'border-gray-200'}
      `}>
        {/* Header */}
        <div className={`
          sticky top-0 z-10
          flex items-center justify-between p-6
          ${isDark ? 'bg-[#1E293B]' : 'bg-white'}
          border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'}
        `}>
          <h2 className={`text-2xl font-bold ${colors.text.primary}`}>
            {isUpdateMode ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={closeModal}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
          >
            <X className={`w-5 h-5 ${colors.text.primary}`} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('firstName')}
                className={`
                  w-full px-4 py-2 rounded-lg border
                  ${isDark ? 'border-[#334155] bg-[#0F172A]' : 'border-gray-300 bg-white'}
                  ${colors.text.primary}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.firstName ? 'border-red-500' : ''}
                `}
                placeholder="Ej: Juan"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('lastName')}
                className={`
                  w-full px-4 py-2 rounded-lg border
                  ${isDark ? 'border-[#334155] bg-[#0F172A]' : 'border-gray-300 bg-white'}
                  ${colors.text.primary}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.lastName ? 'border-red-500' : ''}
                `}
                placeholder="Ej: Pérez"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              className={`
                w-full px-4 py-2 rounded-lg border
                ${isDark ? 'border-[#334155] bg-[#0F172A]' : 'border-gray-300 bg-white'}
                ${colors.text.primary}
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.email ? 'border-red-500' : ''}
              `}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('phone')}
              className={`
                w-full px-4 py-2 rounded-lg border
                ${isDark ? 'border-[#334155] bg-[#0F172A]' : 'border-gray-300 bg-white'}
                ${colors.text.primary}
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.phone ? 'border-red-500' : ''}
              `}
              placeholder="Ej: 71234567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
              Dirección <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className={`
                w-full px-4 py-2 rounded-lg border
                ${isDark ? 'border-[#334155] bg-[#0F172A]' : 'border-gray-300 bg-white'}
                ${colors.text.primary}
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.address ? 'border-red-500' : ''}
              `}
              placeholder="Ej: Av. Principal #123, Zona Centro"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Tipo de Cliente */}
          <div>
            <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
              Tipo de Cliente <span className="text-red-500">*</span>
            </label>
            <select
              {...register('type')}
              className={`
                w-full px-4 py-2 rounded-lg border
                ${isDark ? 'border-[#334155] bg-[#0F172A]' : 'border-gray-300 bg-white'}
                ${colors.text.primary}
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.type ? 'border-red-500' : ''}
              `}
            >
              {clientTypeOptions.filter(opt => opt.value !== '').map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className={`
                px-6 py-2 rounded-lg font-medium
                ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                ${colors.text.primary}
                transition-colors
              `}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-6 py-2 rounded-lg font-medium
                bg-blue-600 hover:bg-blue-700 text-white
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isSubmitting ? 'Guardando...' : isUpdateMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
