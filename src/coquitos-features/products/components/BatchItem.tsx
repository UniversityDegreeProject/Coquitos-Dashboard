import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { BatchButtonsActions } from "./BatchButtonsActions";
import type { ProductBatch } from "../interfaces";

interface BatchItemProps {
  batch: ProductBatch;
  batches: ProductBatch[];
  onDeleteBatch: (batchId: string) => void;
  onUpdateStock: (batchId: string, newStock: number, userId: string, reason?: string, notes?: string) => void;
}

/**
 * Componente de item individual para mostrar información de un batch
 * Muestra código, peso, precio, stock y acciones
 */
export const BatchItem = memo(({ batch, batches, onDeleteBatch, onUpdateStock }: BatchItemProps) => {
  const { isDark } = useTheme();

  return (
    <div
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
      <BatchButtonsActions
        batch={batch}
        batches={batches}
        onDeleteBatch={onDeleteBatch}
        onUpdateStock={onUpdateStock}
      />
    </div>
  );
});

BatchItem.displayName = "BatchItem";

