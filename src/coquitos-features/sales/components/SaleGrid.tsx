import { memo } from "react";
import { type SearchSalesParams, type Sale } from "../interfaces";
import { GenericGridLoader } from "@/shared/components";
import { SaleEmptyState } from "./SaleEmptyState";
import { SaleListItem } from "./SaleListItem";

interface SaleGridProps {
  sales: Sale[];
  isPending: boolean;
  currentParams: SearchSalesParams;
  onPageEmpty?: () => void;
}

/**
 * Componente que muestra las ventas en formato de lista moderna
 * Maneja estados de carga, vacío y renderizado de items
 */
export const SaleGrid = memo(
  ({ sales, isPending, currentParams, onPageEmpty }: SaleGridProps) => {
    // Mostrar loader durante la carga
    if (isPending) {
      return <GenericGridLoader title="Cargando ventas" />;
    }

    // Mostrar estado vacío cuando no hay ventas
    if (sales.length === 0) {
      return <SaleEmptyState />;
    }

    // Renderizar lista de ventas
    return (
      <div className="space-y-4">
        {sales.map((sale) => (
          <SaleListItem
            key={sale.id}
            sale={sale}
            currentParams={currentParams}
            onPageEmpty={onPageEmpty}
          />
        ))}
      </div>
    );
  }
);
