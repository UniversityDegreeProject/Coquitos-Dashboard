import { memo } from "react";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { ProductListSkeleton } from "./ProductListSkeleton";
import { ProductEmptyState } from "./ProductEmptyState";
import { ProductListItem } from "./ProductListItem";
import type { ProductResponse } from "../interfaces";

interface ProductGridProps {
  products: ProductResponse[];
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
}

/**
 * Grid responsivo para mostrar productos
 * Soporta vista de grid y lista, refactorizado con componentes reutilizables
 */
export const ProductGrid = memo(({ 
  products, 
  isLoading = false, 
  viewMode = 'grid'
}: ProductGridProps) => {

  // Mostrar skeleton según el modo de vista
  if (isLoading) {
    return viewMode === 'grid' ? <ProductGridSkeleton /> : <ProductListSkeleton />;
  }

  // Mostrar estado vacío
  if (products.length === 0) {
    return <ProductEmptyState />;
  }

  // Vista de lista
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductListItem key={product.id} product={product} />
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
        />
      ))}
    </div>
  );
});
