import { memo, useCallback, useEffect } from "react";
import { X, Plus, Weight, Coins, Clock } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/shared/hooks/useTheme";
import { LabelInputString } from "@/shared/components";
import { createBatchSchema, type CreateBatchSchema } from "../schemas";
import { useCreateBatch } from "../hooks";
import type { Product, PendingBatch } from "../interfaces";

interface FormBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  mode?: 'create' | 'edit'; // Modo creación (sin productId) o edición (con productId)
  onAddPendingBatch?: (batch: PendingBatch) => void; // Callback para modo creación
}

/**
 * Modal para crear un nuevo batch de producto de peso variable
 * Solo disponible para productos con isVariableWeight = true
 * 
 * Modos:
 * - 'edit': Requiere product.id, crea batch inmediatamente en el backend
 * - 'create': No requiere product.id, almacena batch en estado local mediante callback
 */
export const FormBatchModal = memo(({ isOpen, onClose, product, mode = 'edit', onAddPendingBatch }: FormBatchModalProps) => {
  const { isDark } = useTheme();
  const isCreateMode = mode === 'create';

  // Schema condicional: en modo creación no requerimos productId
  const batchSchemaForMode = isCreateMode 
    ? createBatchSchema.omit({ productId: true })
    : createBatchSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateBatchSchema>({
    resolver: zodResolver(batchSchemaForMode),
    defaultValues: {
      productId: product.id || "",
      weight: "",
      unitPrice: "",
      expirationDate: "",
    },
  });

  // Observar el campo de peso para calcular automáticamente el precio
  const watchedWeight = watch("weight");

  // Hook para crear batch (solo en modo edición)
  const { useCreateBatchMutation } = useCreateBatch({
    productId: product.id || "",
    onSuccessCallback: () => {
      reset();
      onClose();
    },
  });

  // Handler síncrono para cerrar modal
  const handleCloseModal = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  // Handler asíncrono para submit
  const onSubmit = useCallback(async (data: CreateBatchSchema) => {
    if (isCreateMode && onAddPendingBatch) {
      // Modo creación: almacenar batch temporalmente
      const pendingBatch: PendingBatch = {
        tempId: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        weight: parseFloat(data.weight),
        unitPrice: parseFloat(data.unitPrice),
        expirationDate: data.expirationDate && data.expirationDate.trim() !== '' 
          ? data.expirationDate 
          : undefined,
      };
      onAddPendingBatch(pendingBatch);
      reset();
      onClose();
    } else {
      // Modo edición: crear batch inmediatamente en el backend
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const batchData: any = {
        productId: data.productId,
        weight: parseFloat(data.weight),
        unitPrice: parseFloat(data.unitPrice),
      };
      
      // Solo incluir expirationDate si tiene valor
      if (data.expirationDate && data.expirationDate.trim() !== '') {
        batchData.expirationDate = new Date(data.expirationDate).toISOString();
      }
      useCreateBatchMutation.mutate(batchData);
    }
  }, [isCreateMode, onAddPendingBatch, useCreateBatchMutation, reset, onClose]);

  // Calcular automáticamente el precio cuando cambia el peso
  useEffect(() => {
    if (watchedWeight && product.pricePerKg) {
      const weightNum = parseFloat(watchedWeight);
      // Solo calcular si el peso es un número válido y mayor a 0
      if (!isNaN(weightNum) && weightNum > 0) {
        const calculatedPrice = weightNum * product.pricePerKg;
        // Redondear a 2 decimales
        const roundedPrice = Math.round(calculatedPrice * 100) / 100;
        setValue("unitPrice", roundedPrice.toFixed(2), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [watchedWeight, product.pricePerKg, setValue]);

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      reset({
        productId: product.id || "",
        weight: "",
        unitPrice: "",
        expirationDate: "",
      });
    }
  }, [isOpen, product.id, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCloseModal}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md mx-4 rounded-xl shadow-2xl ${
          isDark ? 'bg-[#1E293B]' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
              Agregar Batch
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              {product.name}
            </p>
          </div>
          <button
            onClick={handleCloseModal}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#334155] text-[#94A3B8]' : 'hover:bg-gray-100 text-gray-500'
            }`}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Peso */}
          <LabelInputString
            label="Peso por unidad en kilogramos (kg)"
            name="weight"
            control={control}
            icon={Weight}
            required
            placeholder="Ej: 0.500 o 0.573"
            error={errors.weight?.message}
            type="text"
            inputMode="decimal"
          />

          {/* Precio Unitario */}
          <LabelInputString
            label="Precio por unidad en Bolivianos (Bs)"
            name="unitPrice"
            control={control}
            icon={Coins}
            required
            placeholder="Ej: 25.50 o 14.33"
            error={errors.unitPrice?.message}
            type="text"
            inputMode="decimal"
          />

          {/* Fecha de Vencimiento */}
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
              Fecha de Vencimiento (Opcional)
            </label>
            <div className="relative">
              <Clock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} z-10`} />
              <Controller
                name="expirationDate"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-500 focus:border-[#F59E0B]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#275081]'} focus:ring-2 ring-offset-1 ${isDark ? 'focus:ring-[#F59E0B]/20' : 'focus:ring-[#275081]/20'} outline-none transition-all duration-200`}
                  />
                )}
              />
            </div>
            {errors.expirationDate && (
              <p className="text-red-500 text-xs font-medium">{errors.expirationDate.message}</p>
            )}
          </div>

          {/* Info */}
          <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>Nota:</strong> El lote se creará con stock inicial de 1 unidad.
              <br />
              Precio por kg: Bs {product.pricePerKg ? product.pricePerKg.toFixed(2) : '0.00'}
              {watchedWeight && parseFloat(watchedWeight) > 0 && product.pricePerKg && (
                <>
                  <br />
                  <strong>Cálculo automático:</strong> {watchedWeight} kg × Bs {product.pricePerKg.toFixed(2)}/kg = Bs {((parseFloat(watchedWeight) || 0) * product.pricePerKg).toFixed(2)}
                </>
              )}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={!isCreateMode && useCreateBatchMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r ${isDark ? 'from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90' : 'from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90'} text-white transition-all duration-200 shadow-md hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              disabled={!isCreateMode && useCreateBatchMutation.isPending}
            >
              {!isCreateMode && useCreateBatchMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {isCreateMode ? 'Agregar Batch' : 'Crear Batch'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

FormBatchModal.displayName = "FormBatchModal";

