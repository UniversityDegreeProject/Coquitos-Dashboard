import { memo, useCallback } from "react";
import { Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useCategoryStore } from "../store/category.store";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Category } from "../interfaces";

interface CategoryButtonsActionsProps {
  category: Category;
}

/**
 * Componente de botones de acción para cada categoría
 * Incluye editar y eliminar con confirmación, optimizado con memoización
 */
export const CategoryButtonsActions = memo(({ category }: CategoryButtonsActionsProps) => {
  const { isDark } = useTheme();
  const setOpenModalUpdate = useCategoryStore(useShallow((state) => state.setOpenModalUpdate));
  const { deleteCategoryMutation } = useDeleteCategory();

  // Memoizar el handler de edición
  const handleEdit = useCallback(() => {
    setOpenModalUpdate(category);
  }, [setOpenModalUpdate, category]);

  // Memoizar el handler de eliminación
  const handleDelete = useCallback(async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-xl',
        title: 'text-xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600',
      },
    });

    if (result.isConfirmed && category.id) {
      deleteCategoryMutation.mutate(category.id);
    }
  }, [category.name, category.id, deleteCategoryMutation]);

  return (
    <div className="flex space-x-2 flex-shrink-0">
      <button
        onClick={handleEdit}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-blue-400 hover:bg-blue-500/10 hover:text-blue-300'
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
        }`}
        aria-label="Editar categoría"
        title="Editar categoría"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={handleDelete}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
        }`}
        aria-label="Eliminar categoría"
        title="Eliminar categoría"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
});

