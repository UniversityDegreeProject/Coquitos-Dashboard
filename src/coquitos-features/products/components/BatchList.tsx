import { memo } from "react";
import { BatchItem } from "./BatchItem";
import { BatchEmptyState } from "./BatchEmptyState";
import type { ProductBatch } from "../interfaces";

interface BatchListProps {
  batches: ProductBatch[];
  productId: string;
  onDeleteBatch: (batchId: string) => void;
  onUpdateStock: (batchId: string, newStock: number, userId: string, reason?: string, notes?: string) => void;
}

/**
 * Componente contenedor para mostrar lista de batches de un producto de peso variable
 * Sigue el mismo patrón de ProductGrid con separación de responsabilidades
 */
export const BatchList = memo(({ batches, productId, onDeleteBatch, onUpdateStock }: BatchListProps) => {
  
  // Estado vacío
  if (batches.length === 0) {
    return <BatchEmptyState />;
  }

  // Lista de batches
  return (
    <div className="space-y-2">
      {batches.map((batch) => (
        <BatchItem
          key={batch.id}
          batch={batch}
          batches={batches}
          productId={productId}
          onDeleteBatch={onDeleteBatch}
          onUpdateStock={onUpdateStock}
        />
      ))}
    </div>
  );
});

BatchList.displayName = "BatchList";
