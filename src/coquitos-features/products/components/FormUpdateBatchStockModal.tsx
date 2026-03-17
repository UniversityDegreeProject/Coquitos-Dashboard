import { memo, useEffect, useState } from "react";
import { X, TrendingUp } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/shared/hooks/useTheme";
import { LabelTextarea } from "@/shared/components";
import {
  updateBatchStockSchema,
  type UpdateBatchStockSchema,
} from "../schemas";
import type { ProductBatch } from "../interfaces";
import { createPortal } from "react-dom";

interface FormUpdateBatchStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: ProductBatch;
  batches: ProductBatch[];
  onSubmit: (
    batchId: string,
    newStock: number,
    userId: string,
    reason?: string,
    notes?: string
  ) => void;
  userId: string;
  isPending?: boolean;
}

/**
 * Modal para actualizar el stock de un batch existente
 * Muestra preview del impacto en el stock total del producto
 */
export const FormUpdateBatchStockModal = memo(
  ({
    isOpen,
    onClose,
    batch,
    batches,
    onSubmit,
    userId,
    isPending = false,
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
      const newBatchStock =
        typeof watchedStock === "string"
          ? parseInt(watchedStock) || 0
          : watchedStock || 0;
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
      const newStock =
        typeof data.stock === "string" ? parseInt(data.stock) : data.stock || 0;
      onSubmit(
        batch.id,
        newStock,
        userId,
        data.reason || undefined,
        data.notes || undefined
      );
      // No cerrar aquí, el hook se encargará de cerrar después del éxito
    };

    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`relative w-full max-w-md mx-4 rounded-xl shadow-2xl max-h-[90vh] flex flex-col ${
            isDark ? "bg-[#1E293B]" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${
              isDark ? "border-[#334155]" : "border-gray-200"
            }`}
          >
            <div>
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-[#F8FAFC]" : "text-gray-900"
                }`}
              >
                Reasignar Stock
              </h2>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-[#94A3B8]" : "text-gray-600"
                }`}
              >
                {batch.batchCode}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-[#334155] text-[#94A3B8]"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form - Contenido con scroll */}
          <form
            id="update-batch-stock-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(handleFormSubmit)(e);
            }}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {/* Información del batch */}
            <div
              className={`p-3 rounded-lg ${
                isDark
                  ? "bg-[#0F172A]/50 border border-[#334155]"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div
                className={`text-sm ${
                  isDark ? "text-[#94A3B8]" : "text-gray-600"
                }`}
              >
                <p>
                  Peso:{" "}
                  <span className="font-semibold">
                    {batch.weight.toFixed(3)} kg
                  </span>
                </p>
                <p>
                  Precio:{" "}
                  <span className="font-semibold">
                    Bs {batch.unitPrice.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            {/* Stock Stats */}
            <div
              className={`grid grid-cols-2 gap-3 p-3 rounded-lg ${
                isDark
                  ? "bg-[#0F172A]/50 border border-[#334155]"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div>
                <p
                  className={`text-xs ${
                    isDark ? "text-[#64748B]" : "text-gray-500"
                  }`}
                >
                  Stock Batch Actual
                </p>
                <p
                  className={`text-lg font-bold ${
                    isDark ? "text-[#F8FAFC]" : "text-gray-800"
                  }`}
                >
                  {batch.stock} ud.
                </p>
              </div>
              <div>
                <p
                  className={`text-xs ${
                    isDark ? "text-[#64748B]" : "text-gray-500"
                  }`}
                >
                  Stock Total Producto
                </p>
                <p
                  className={`text-lg font-bold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {previewTotalStock} ud.
                </p>
              </div>
            </div>

            {/* Nuevo Stock */}
            <Controller
              name="stock"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="stock"
                    className={`block text-sm font-medium ${
                      isDark ? "text-[#E2E8F0]" : "text-gray-700"
                    }`}
                  >
                    Nuevo Stock del Batch{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <TrendingUp
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark
                          ? "text-[#94A3B8] group-focus-within:text-[#F59E0B]"
                          : "text-gray-400 group-focus-within:text-[#275081]"
                      } transition-colors`}
                    />
                    <input
                      {...field}
                      id="stock"
                      type="number"
                      value={typeof value === "string" ? value : value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === "" ? "" : val);
                      }}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.stock
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                          : isDark
                          ? "border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10 bg-[#0F172A] text-[#F8FAFC]"
                          : "border-gray-200 focus:border-[#275081] focus:ring-[#275081]/10 bg-white text-gray-800"
                      } focus:ring-2 ring-offset-1 outline-none transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50`}
                      placeholder="Ej: 5"
                      min={0}
                      step={1}
                      aria-invalid={errors.stock ? "true" : "false"}
                      aria-describedby={
                        errors.stock ? "stock-error" : undefined
                      }
                    />
                  </div>
                  {errors.stock && (
                    <p
                      id="stock-error"
                      className="text-red-600 text-xs mt-1"
                      role="alert"
                    >
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              )}
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
          </form>

          {/* Footer con botones - Fixed */}
          <div
            className={`flex gap-3 p-6 border-t flex-shrink-0 ${
              isDark ? "border-[#334155]" : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="update-batch-stock-form"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(handleFormSubmit)(e);
              }}
              disabled={isPending}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r ${
                isDark
                  ? "from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90"
                  : "from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90"
              } text-white transition-all duration-200 shadow-md hover:shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Actualizar
                </>
              )}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

FormUpdateBatchStockModal.displayName = "FormUpdateBatchStockModal";
