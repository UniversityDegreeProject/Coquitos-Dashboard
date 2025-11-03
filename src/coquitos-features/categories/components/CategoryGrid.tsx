import { memo } from "react";
import { type SearchCategoriesParams, type Category } from "../interfaces";
import { GenericGridLoader } from "@/shared/components";
import { CategoryEmptyState, CategoryListItem } from "./";

interface CategoryGridProps {
  categories: Category[];
  isPending: boolean;
  currentParams: SearchCategoriesParams;
  onPageEmpty?: () => void;
}

/**
 * Componente que muestra los usuarios en formato de lista moderna
 * Refactorizado con componentes reutilizables para mejor mantenibilidad
 */
export const CategoryGrid = memo(({ categories, isPending, currentParams, onPageEmpty }: CategoryGridProps) => {
  // Mostrar skeleton loader durante la carga
  if (isPending) {
    return <GenericGridLoader title="Cargando categorías" />;
  }

  // Mostrar estado vacío cuando no hay categorías
  if (categories.length === 0) {
    return <CategoryEmptyState />;
  }

  // Renderizar lista de usuarios
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryListItem key={category.id} category={category} currentParams={currentParams} onPageEmpty={onPageEmpty} />
      ))}
    </div>
  );
});
