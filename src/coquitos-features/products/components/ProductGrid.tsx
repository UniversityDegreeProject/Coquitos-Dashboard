import { memo } from "react";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { ProductListSkeleton } from "./ProductListSkeleton";
import { ProductEmptyState } from "./ProductEmptyState";
import { ProductListItem } from "./ProductListItem";
import type { Product, SearchProductsParams } from "../interfaces";
import { useProductStore } from "../store/product.store";
import { useShallow } from "zustand/shallow";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  currentParams: SearchProductsParams;
  onPageEmpty: () => void;
}

/**
 * Grid responsivo para mostrar productos
 * Soporta vista de grid y lista, refactorizado con componentes reutilizables
 */
export const ProductGrid = memo(({ products, isLoading = false, currentParams, onPageEmpty }: ProductGridProps) => {

  // * Zustand 
  const viewMode = useProductStore(useShallow((state) => state.viewMode));

  if (isLoading) {
    return viewMode === 'grid' ? <ProductGridSkeleton /> : <ProductListSkeleton />;
  }
  if (products.length === 0) {
    return <ProductEmptyState />;
  }

  // Vista de lista
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductListItem key={product.id} product={product} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currentParams={currentParams}
          onPageEmpty={onPageEmpty}
        />
      ))}
    </div>
  );
});
