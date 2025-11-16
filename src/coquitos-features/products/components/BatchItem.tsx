import { memo } from "react";
import { Clock } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { BatchButtonsActions } from "./BatchButtonsActions";
import { formatExpirationDate, getDaysUntilExpiration } from "../helpers";
import type { ProductBatch } from "../interfaces";

interface BatchItemProps {
  batch: ProductBatch;
  batches: ProductBatch[];
  productId: string;
  onDeleteBatch: (batchId: string) => void;
  onUpdateStock: (batchId: string, newStock: number, userId: string, reason?: string, notes?: string) => void;
}

/**
 * Componente de item individual para mostrar información de un batch
 * Muestra código, peso, precio, stock y acciones
 */
export const BatchItem = memo(({ batch, batches, productId, onDeleteBatch, onUpdateStock }: BatchItemProps) => {
  const { isDark } = useTheme();
  
  const daysUntilExpiration = getDaysUntilExpiration(batch.expirationDate);
  const isNearExpiration = daysUntilExpiration !== null && daysUntilExpiration >= 2 && daysUntilExpiration <= 4;
  const isExpiringTomorrow = daysUntilExpiration === 1;
  const isExpiringToday = daysUntilExpiration === 0;

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
          {batch.expirationDate && (
            <>
              <span>•</span>
              <span className={`flex items-center gap-1 ${
                isExpiringToday 
                  ? 'text-red-600 font-semibold' 
                  : isExpiringTomorrow 
                  ? 'text-orange-500 font-semibold'
                  : isNearExpiration 
                  ? 'text-red-500 font-semibold' 
                  : ''
              }`}>
                <Clock className={`w-3 h-3 ${
                  isExpiringToday 
                    ? 'text-red-600' 
                    : isExpiringTomorrow 
                    ? 'text-orange-500'
                    : isNearExpiration 
                    ? 'text-red-500' 
                    : ''
                }`} />
                Vence: {formatExpirationDate(batch.expirationDate)}
                {daysUntilExpiration !== null && daysUntilExpiration <= 1 && (
                  <span className={`font-bold ${
                    isExpiringToday ? 'text-red-600' : 'text-orange-500'
                  }`}>
                    {isExpiringToday ? ' (Hoy)' : ' (Mañana)'}
                  </span>
                )}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Acciones */}
      <BatchButtonsActions
        batch={batch}
        batches={batches}
        productId={productId}
        onDeleteBatch={onDeleteBatch}
        onUpdateStock={onUpdateStock}
      />
    </div>
  );
});

BatchItem.displayName = "BatchItem";

