import { memo, useCallback } from "react";
import { Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Category, SearchCategoriesParams } from "../interfaces";
import { useCategoryStore } from "../store/category.store";
import { useDeleteCategory } from "../hooks/useDeleteCategory";

interface CategoryButtonsActionsProps {
  category: Category;
  currentParams: SearchCategoriesParams;
  onPageEmpty?: () => void;
}

export const CategoryButtonsActions = memo(({ category, currentParams, onPageEmpty }: CategoryButtonsActionsProps) => {
  const { isDark } = useTheme();
  const setOpenModalUpdate = useCategoryStore(useShallow((state) => state.setOpenModalUpdate));
  const setIsMutation = useCategoryStore(useShallow((state) => state.setIsMutation));
  
  // Pasar parámetros actuales al hook
  const { deleteCategoryMutation } = useDeleteCategory({ 
    currentParams,
    onPageEmpty,
    onFinally: () => setIsMutation(false)
  });

  
  const handleDeleteCategory = useCallback(() => {
    Swal.fire({
      title: '¿Estás seguro de querer eliminar esta categoría?',
      text: `La categoría ${category.name} se eliminará permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsMutation(true);
        deleteCategoryMutation.mutate(category.id!);
      }
    });
  }, [category.name, category.id, deleteCategoryMutation, setIsMutation]);

  // * Handler para editar usuario
  const handleEditCategory = useCallback(() => {
    setOpenModalUpdate(category);
  }, [category, setOpenModalUpdate]);
 




  return (
    <div className="flex space-x-2 flex-shrink-0">
      <button
        onClick={handleEditCategory}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-blue-400 hover:bg-blue-500/10 hover:text-blue-300'
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
        }`}
        aria-label="Editar categoría"
        title="Editar categoría"
        type="button"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      <button
        onClick={handleDeleteCategory}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
        }`}
        aria-label="Eliminar categoría"
        title="Eliminar categoría"
        type="button"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      
    </div>
  );
});