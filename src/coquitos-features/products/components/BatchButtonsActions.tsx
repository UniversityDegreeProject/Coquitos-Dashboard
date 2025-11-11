import { memo, useCallback, useState } from "react";
import { Trash2, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/auth/store/auth.store";
import { FormUpdateBatchStockModal } from "./FormUpdateBatchStockModal";
import type { ProductBatch } from "../interfaces";
import Swal from "sweetalert2";

interface BatchButtonsActionsProps {
  batch: ProductBatch;
  batches: ProductBatch[];
  onDeleteBatch: (batchId: string) => void;
  onUpdateStock: (batchId: string, newStock: number, userId: string, reason?: string, notes?: string) => void;
}

/**
 * Componente de acciones para cada batch
 * Maneja internamente los handlers de reasignar stock y eliminar
 */
export const BatchButtonsActions = memo(({ batch, batches, onDeleteBatch, onUpdateStock }: BatchButtonsActionsProps) => {
  const user = useAuthStore((state) => state.user);
  const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState(false);

  // Handler para eliminar batch
  const handleDeleteBatch = useCallback(() => {
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
  }, [batch, onDeleteBatch]);

  // Handler para abrir modal de actualizar stock
  const handleOpenUpdateStockModal = useCallback(() => {
    if (!user?.id) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo identificar el usuario',
        icon: 'error',
      });
      return;
    }
    setIsUpdateStockModalOpen(true);
  }, [user]);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Botón de reasignar stock */}
        <button
          onClick={handleOpenUpdateStockModal}
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
          title="Reasignar stock"
          type="button"
        >
          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </button>

        {/* Botón de eliminar */}
        <button
          onClick={handleDeleteBatch}
          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={batch.stock > 0 ? "No se puede eliminar con stock" : "Eliminar batch"}
          type="button"
          disabled={batch.stock > 0}
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </div>

      {/* Modal de actualizar stock */}
      {isUpdateStockModalOpen && user?.id && (
        <FormUpdateBatchStockModal
          isOpen={isUpdateStockModalOpen}
          onClose={() => setIsUpdateStockModalOpen(false)}
          batch={batch}
          batches={batches}
          onSubmit={onUpdateStock}
          userId={user.id}
        />
      )}
    </>
  );
});

BatchButtonsActions.displayName = "BatchButtonsActions";
