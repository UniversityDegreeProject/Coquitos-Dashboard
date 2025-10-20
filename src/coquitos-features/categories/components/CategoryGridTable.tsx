import { memo } from "react";
import { type Category } from "../interfaces";
import { CategoryTableSkeleton } from "./CategoryTableSkeleton";
import { CategoryEmptyState } from "./CategoryEmptyState";
import { CategoryListItem } from "./CategoryListItem";

interface CategoryGridTableProps {
  categories: Category[];
  isPending: boolean;
}

/**
 * Componente que muestra las categorías en formato de lista moderna
 * Refactorizado con componentes reutilizables para mejor mantenibilidad
 */
export const CategoryGridTable = memo(({ categories, isPending }: CategoryGridTableProps) => {
  // Mostrar skeleton loader durante la carga
  if (isPending) {
    return <CategoryTableSkeleton />;
  }

  // Mostrar estado vacío cuando no hay categorías
  if (categories.length === 0) {
    return <CategoryEmptyState />;
  }

  // Renderizar lista de categorías
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryListItem key={category.id} category={category} />
      ))}
    </div>
  );
});

