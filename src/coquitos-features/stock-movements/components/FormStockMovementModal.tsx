// * Library
import { useForm, type SubmitHandler } from "react-hook-form";
import { X, Package, TrendingUp, FileText, Hash, StickyNote, Loader2 } from "lucide-react";
import { useEffect } from "react";

// * Others
import { LabelInputNumber, LabelInputString, LabelSelect, LabelTextarea } from "@/shared/components";
import { useStockMovementStore } from "../store/stock-movement.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { movementTypeOptions } from "../const";
import { createStockMovementSchema, type StockMovementSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStockMovement } from "../hooks";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@/auth/store/auth.store";
import type { User } from "@/coquitos-features/users/interfaces";
import { generateReferenceByType } from "../helpers";
import type { SearchProductsParams } from "@/coquitos-features/products/interfaces";

const onlyMovementTypeOptions = movementTypeOptions.filter((option) => option.value !== "");

/**
 * Modal de formulario para registrar movimientos de stock
 * Permite ajustar el inventario de un producto específico
 */
const initialValues: StockMovementSchema = {
  productId: "",
  type: "Reabastecimiento",
  quantity: 1,
  reason: "",
  reference: "",
  notes: "",
};

interface FormStockMovementModalProps {
  currentParams : SearchProductsParams
}
export const FormStockMovementModal = ({ currentParams }: FormStockMovementModalProps) => {
  // * Zustand
  const closeModal = useStockMovementStore(useShallow((state) => state.closeModal));
  const selectedProduct = useStockMovementStore(useShallow((state) => state.selectedProduct));
  const user = useAuthStore(useShallow((state) => state.user));
  const { id: userId } = user as User;

  // * Theme
  const { isDark } = useTheme();

  // * TanstackQuery
  const { useCreateStockMovementMutation, isPending } = useCreateStockMovement({ currentParams });
  
  // * React Hook Form
  const { control, setValue, handleSubmit, watch, formState: { errors, isValid } } = useForm<StockMovementSchema>({
    resolver: zodResolver(createStockMovementSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Observar la cantidad y tipo para mostrar información útil
  const watchedQuantity = watch("quantity");
  const watchedType = watch("type");

  const onSubmitForm: SubmitHandler<StockMovementSchema> = (data) => {
    closeModal();
    useCreateStockMovementMutation.mutate({
      ...data,
      userId: userId!,
    });
  };

  // Effect para establecer el productId cuando se abre el modal
  useEffect(() => {
    if (selectedProduct) {
      setValue('productId', selectedProduct.id!);
    }
  }, [selectedProduct, setValue]);

  // Effect para generar referencia automáticamente cuando cambia el tipo
  useEffect(() => {
    if (watchedType) {
      const autoReference = generateReferenceByType(watchedType);
      setValue('reference', autoReference, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watchedType, setValue]);

  // Calcular nuevo stock estimado
  const calculateNewStock = () => {
    if (!selectedProduct) return 0;
    const currentStock = selectedProduct.stock || 0;
    const quantity = watchedQuantity || 0;
    
    // Tipos que aumentan el stock
    const increaseTypes = ["Reabastecimiento", "Compra", "Devolucion"];
    // Tipos que disminuyen el stock
    const decreaseTypes = ["Venta", "Ajuste", "Dañado"];
    
    if (increaseTypes.includes(watchedType)) {
      return currentStock + quantity;
    } else if (decreaseTypes.includes(watchedType)) {
      return Math.max(0, currentStock - quantity);
    }
    
    return currentStock;
  };

  const newStockEstimated = calculateNewStock();

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-[#1E293B]/95' : 'bg-white/95'} backdrop-blur-md rounded-2xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border ${isDark ? 'border-[#334155]/20' : 'border-white/20'}`}>
        {/* Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-[#1E293B]/80' : 'bg-white/80'} backdrop-blur-md p-4 border-b ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'} rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
                <TrendingUp className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                  Ajustar Stock
                </h2>
                <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                  {selectedProduct.name}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className={`p-2 ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg transition-all duration-200 cursor-pointer`}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info del producto */}
          <div className={`mt-3 p-3 rounded-lg ${isDark ? 'bg-[#0F172A]/50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${isDark ? 'text-[#E2E8F0]' : 'text-gray-700'}`}>
                  Stock Actual:
                </span>
                <span className={`text-sm font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
                  {selectedProduct.stock || 0} unidades
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                  Nuevo Stock:
                </span>
                <span className={`text-sm font-bold ${newStockEstimated > (selectedProduct.stock || 0) ? 'text-green-500' : newStockEstimated < (selectedProduct.stock || 0) ? 'text-red-500' : isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
                  {newStockEstimated} unidades
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-4 space-y-4">
          {/* Primera fila - Tipo y Cantidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelSelect
              label="Tipo de Movimiento"
              name="type"
              control={control}
              options={onlyMovementTypeOptions}
              icon={TrendingUp}
              placeholder="Selecciona un tipo"
              required
              error={errors.type?.message}
            />
            
            <LabelInputNumber
              label="Cantidad"
              name="quantity"
              control={control}
              icon={Hash}
              required
              placeholder="Ingresa la cantidad"
              min={1}
              max={10000}
              error={errors.quantity?.message}
            />
          </div>

          {/* Segunda fila - Referencia */}
          <div className="grid grid-cols-1 gap-4">
            <LabelInputString
              label="Referencia"
              name="reference"
              control={control}
              icon={FileText}
              required
              placeholder="Ej: FACT-2024-001, ORD-12345, etc."
              error={errors.reference?.message}
            />
          </div>

          {/* Tercera fila - Motivo */}
          <div className="grid grid-cols-1 gap-4">
            <LabelTextarea
              label="Motivo"
              name="reason"
              control={control}
              icon={FileText}
              required
              placeholder="Describe el motivo de este movimiento de stock..."
              rows={3}
              error={errors.reason?.message}
            />
          </div>

          {/* Cuarta fila - Notas (Opcional) */}
          <div className="grid grid-cols-1 gap-4">
            <LabelTextarea
              label="Notas Adicionales (Opcional)"
              name="notes"
              control={control}
              icon={StickyNote}
              placeholder="Información adicional o comentarios..."
              rows={2}
              error={errors.notes?.message}
            />
          </div>

          {/* Botones */}
          <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'}`}>
            <button
              type="button"
              onClick={closeModal}
              className={`flex-1 px-4 py-2.5 border ${isDark ? 'border-[#334155] text-[#E2E8F0] hover:bg-[#334155]/50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-all duration-200 font-medium text-sm cursor-pointer`}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isPending || !isValid}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${isDark ? 'from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90' : 'from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90'} text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2`}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? 'Registrando...' : 'Registrar Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

