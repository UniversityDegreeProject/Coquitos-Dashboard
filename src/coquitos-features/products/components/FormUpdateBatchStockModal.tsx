import { memo, useEffect, useState } from "react";
import { X, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/shared/hooks/useTheme";
import { LabelInputString, LabelTextarea } from "@/shared/components";
import { updateBatchStockSchema, type UpdateBatchStockSchema } from "../schemas";
import type { ProductBatch } from "../interfaces";

interface FormUpdateBatchStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: ProductBatch;
  batches: ProductBatch[];
  onSubmit: (batchId: string, newStock: number, userId: string, reason?: string, notes?: string) => void;
  userId: string;
}

/**
 * Modal para actualizar el stock de un batch existente
 * Muestra preview del impacto en el stock total del producto
 */
export const FormUpdateBatchStockModal = memo(({ 
  isOpen, 
  onClose, 
  batch, 
  batches, 
  onSubmit,
  userId 
}: FormUpdateBatchStockModalProps) => {
  const { isDark } = useTheme();
  
  // Estado para preview del stock total
  const [previewTotalStock, setPreviewTotalStock] = useState<number>(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateBatchStockSchema>({
    resolver: zodResolver(updateBatchStockSchema),
    defaultValues: {
      batchId: batch.id,
      stock: batch.stock.toString(),
      userId: userId,
      reason: "",
      notes: "",
    },
  });

  // Observar cambios en el stock para actualizar preview
  const watchedStock = watch("stock");

  // Calcular stock total del producto
  const currentTotalStock = batches.reduce((sum, b) => sum + b.stock, 0);

  // Actualizar preview cuando cambia el stock
  useEffect(() => {
    const newBatchStock = parseInt(watchedStock) || 0;
    const difference = newBatchStock - batch.stock;
    const newTotalStock = currentTotalStock + difference;
    setPreviewTotalStock(newTotalStock);
  }, [watchedStock, batch.stock, currentTotalStock]);

  // Inicializar preview al abrir modal
  useEffect(() => {
    if (isOpen) {
      setPreviewTotalStock(currentTotalStock);
      reset({
        batchId: batch.id,
        stock: batch.stock.toString(),
        userId: userId,
        reason: "",
        notes: "",
      });
    }
  }, [isOpen, batch, userId, currentTotalStock, reset]);

  const handleFormSubmit = (data: UpdateBatchStockSchema) => {
    const newStock = parseInt(data.stock);
    onSubmit(
      batch.id,
      newStock,
      userId,
      data.reason || undefined,
      data.notes || undefined
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
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
              Reasignar Stock
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              {batch.batchCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#334155] text-[#94A3B8]' : 'hover:bg-gray-100 text-gray-500'
            }`}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Información del batch */}
          <div className={`p-3 rounded-lg ${isDark ? 'bg-[#0F172A]/50 border border-[#334155]' : 'bg-gray-50 border border-gray-200'}`}>
            <div className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              <p>Peso: <span className="font-semibold">{batch.weight.toFixed(3)} kg</span></p>
              <p>Precio: <span className="font-semibold">Bs {batch.unitPrice.toFixed(2)}</span></p>
            </div>
          </div>

          {/* Stock Stats */}
          <div className={`grid grid-cols-2 gap-3 p-3 rounded-lg ${isDark ? 'bg-[#0F172A]/50 border border-[#334155]' : 'bg-gray-50 border border-gray-200'}`}>
            <div>
              <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-500'}`}>Stock Batch Actual</p>
              <p className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                {batch.stock} ud.
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-500'}`}>Stock Total Producto</p>
              <p className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {previewTotalStock} ud.
              </p>
            </div>
          </div>

          {/* Nuevo Stock */}
          <LabelInputString
            label="Nuevo Stock del Batch"
            name="stock"
            control={control}
            icon={TrendingUp}
            required
            placeholder="Ej: 5"
            error={errors.stock?.message}
            type="text"
            inputMode="numeric"
          />

          {/* Motivo */}
          <LabelTextarea
            label="Motivo"
            name="reason"
            control={control}
            placeholder="Ej: Llegó reabastecimiento, ajuste por inventario..."
            rows={2}
            error={errors.reason?.message}
          />

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

FormUpdateBatchStockModal.displayName = "FormUpdateBatchStockModal";

