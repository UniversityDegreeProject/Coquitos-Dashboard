import { useState, useMemo } from 'react';
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import { useGetStockMovements } from "../hooks";
import type { StockMovementType } from "../interfaces";
import {
  StockMovementsHeader,
  StockMovementsStats,
  StockMovementsFilters,
  StockMovementsTable,
} from "../components";

/**
 * Página de listado de todos los movimientos de stock
 * Muestra el historial completo con búsqueda y filtros
 */
export const StockMovementsPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<StockMovementType | "">("");

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // * TanStack Query
  const { stockMovements, isLoading } = useGetStockMovements();

  // * Filtrar movimientos basado en los filtros
  const filteredMovements = useMemo(() => {
    return stockMovements.filter(movement => {
      const matchesSearch = 
        movement.reference?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        movement.reason?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        movement.notes?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesType = !typeFilter || movement.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [stockMovements, debouncedSearch, typeFilter]);

  return (
    <div className="space-y-6">
      <StockMovementsHeader />
      
      <StockMovementsStats movements={filteredMovements} />
      
      <StockMovementsFilters
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setTypeFilter}
      />
      
      <StockMovementsTable
        movements={filteredMovements}
        isLoading={isLoading}
        searchTerm={searchTerm}
        typeFilter={typeFilter}
      />
    </div>
  );
};

