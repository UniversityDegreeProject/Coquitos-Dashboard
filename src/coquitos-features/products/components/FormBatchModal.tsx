import { memo, useCallback, useEffect } from "react";
import { X, Plus, Weight, Coins } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/shared/hooks/useTheme";
import { LabelInputString } from "@/shared/components";
import { createBatchSchema, type CreateBatchSchema } from "../schemas";
import { useCreateBatch } from "../hooks";
import type { Product } from "../interfaces";

interface FormBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

/**
 * Modal para crear un nuevo batch de producto de peso variable
 * Solo disponible para productos con isVariableWeight = true
 */
export const FormBatchModal = memo(({ isOpen, onClose, product }: FormBatchModalProps) => {
  const { isDark } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBatchSchema>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      productId: product.id || "",
      weight: "",
      unitPrice: "",
    },
  });

  // Hook para crear batch
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
    // Convertir strings a números para el backend
    const batchData = {
      productId: data.productId,
      weight: parseFloat(data.weight),
      unitPrice: parseFloat(data.unitPrice),
    };
    useCreateBatchMutation.mutate(batchData);
  }, [useCreateBatchMutation]);

  // Resetear formulario cuando cambia el producto
  useEffect(() => {
    if (isOpen && product.id) {
      reset({
        productId: product.id,
        weight: "",
        unitPrice: "",
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
            label="Peso (kg)"
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
            label="Precio Unitario (Bs)"
            name="unitPrice"
            control={control}
            icon={Coins}
            required
            placeholder="Ej: 25.50 o 14.33"
            error={errors.unitPrice?.message}
            type="text"
            inputMode="decimal"
          />

          {/* Info */}
          <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>Nota:</strong> El batch se creará con stock inicial de 1 unidad.
              Precio por kg: Bs {product.pricePerKg ? product.pricePerKg.toFixed(2) : '0.00'}
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
              disabled={useCreateBatchMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r ${isDark ? 'from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90' : 'from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90'} text-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              disabled={useCreateBatchMutation.isPending}
            >
              {useCreateBatchMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Crear Batch
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

