import { memo, useCallback } from "react";
import { Trash2, Package, TrendingUp } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuthStore } from "@/auth/store/auth.store";
import type { ProductBatch } from "../interfaces";
import Swal from "sweetalert2";

interface BatchListProps {
  batches: ProductBatch[];
  onDeleteBatch: (batchId: string) => void;
  onUpdateStock: (batchId: string, newStock: number, userId: string, reason?: string, notes?: string) => void;
}

/**
 * Componente para mostrar lista de batches de un producto de peso variable
 * Muestra información de peso, precio, stock y acciones
 */
export const BatchList = memo(({ batches, onDeleteBatch, onUpdateStock }: BatchListProps) => {
  const { isDark } = useTheme();
  const user = useAuthStore((state) => state.user);

  // Handler para eliminar batch
  const handleDeleteBatch = useCallback((batch: ProductBatch) => {
    if (batch.stock > 0) {
      Swal.fire({
        title: 'No se puede eliminar',
        text: `El batch "${batch.batchCode}" tiene ${batch.stock} unidad(es) en stock`,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    Swal.fire({
      title: '¿Eliminar batch?',
      text: `¿Estás seguro de eliminar "${batch.batchCode}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteBatch(batch.id);
      }
    });
  }, [onDeleteBatch]);

  // Handler para actualizar stock
  const handleUpdateStock = useCallback(async (batch: ProductBatch) => {
    if (!user?.id) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo identificar el usuario',
        icon: 'error',
      });
      return;
    }

    // Calcular stock total del producto
    const currentTotalStock = batches.reduce((sum, b) => sum + b.stock, 0);

    const { value: formValues } = await Swal.fire({
      title: 'Reasignar Stock',
      html: `
        <div class="text-left">
          <p class="text-sm text-gray-600 mb-4">
            Batch: <strong>${batch.batchCode}</strong><br/>
            Peso: <strong>${batch.weight}kg</strong> | Precio: <strong>Bs ${batch.unitPrice}</strong>
          </p>
          <div class="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="text-xs text-gray-500">Stock Batch</p>
              <p class="text-lg font-bold text-gray-800">${batch.stock} ud.</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Stock Total Producto</p>
              <p class="text-lg font-bold text-blue-600" id="total-stock-display">${currentTotalStock} ud.</p>
            </div>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nuevo Stock del Batch *</label>
            <input 
              id="swal-input-stock" 
              type="number" 
              min="0" 
              step="1" 
              value="${batch.stock}"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              oninput="
                const newBatchStock = parseInt(this.value) || 0;
                const difference = newBatchStock - ${batch.stock};
                const newTotalStock = ${currentTotalStock} + difference;
                document.getElementById('total-stock-display').innerText = newTotalStock + ' ud.';
              "
            />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo (Opcional)</label>
            <textarea 
              id="swal-input-reason" 
              placeholder="Ej: Llegó reabastecimiento, ajuste por inventario..." 
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const stockInput = document.getElementById('swal-input-stock') as HTMLInputElement;
        const reasonInput = document.getElementById('swal-input-reason') as HTMLTextAreaElement;
        
        const newStock = parseInt(stockInput.value);
        
        if (isNaN(newStock) || newStock < 0) {
          Swal.showValidationMessage('Ingresa un stock válido mayor o igual a 0');
          return null;
        }
        
        return {
          stock: newStock,
          reason: reasonInput.value.trim() || undefined,
        };
      }
    });

    if (formValues) {
      onUpdateStock(
        batch.id, 
        formValues.stock, 
        user.id,
        formValues.reason,
        undefined
      );
    }
  }, [onUpdateStock, user, batches]);

  if (batches.length === 0) {
    return (
      <div className={`text-center py-8 rounded-lg border-2 border-dashed ${isDark ? 'border-[#334155] bg-[#0F172A]/30' : 'border-gray-300 bg-gray-50'}`}>
        <Package className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
        <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Aún no hay batches registrados
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-[#64748B]' : 'text-gray-500'}`}>
          Agrega un batch para empezar a registrar unidades
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {batches.map((batch) => (
        <div
          key={batch.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            isDark ? 'bg-[#0F172A]/50 border-[#334155]' : 'bg-gray-50 border-gray-200'
          } hover:${isDark ? 'bg-[#1E293B]' : 'bg-gray-100'} transition-colors`}
        >
          {/* Información del batch */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-sm font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
                {batch.batchCode}
              </span>
              {batch.stock <= 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-md">
                  Sin stock
                </span>
              )}
            </div>
            <div className={`flex items-center gap-4 mt-1 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              <span>Peso: {batch.weight.toFixed(3)} kg</span>
              <span>•</span>
              <span>Precio: Bs {batch.unitPrice.toFixed(2)}</span>
              <span>•</span>
              <span className="font-semibold">Stock: {batch.stock} ud.</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Botón de reasignar stock */}
            <button
              onClick={() => handleUpdateStock(batch)}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
              title="Reasignar stock"
              type="button"
            >
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>

            {/* Botón de eliminar */}
            <button
              onClick={() => handleDeleteBatch(batch)}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={batch.stock > 0 ? "No se puede eliminar con stock" : "Eliminar batch"}
              type="button"
              disabled={batch.stock > 0}
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

BatchList.displayName = "BatchList";

