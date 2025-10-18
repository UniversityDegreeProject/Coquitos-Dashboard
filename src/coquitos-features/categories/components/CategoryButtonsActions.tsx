import { Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useCategoryStore } from "../store/category.store";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useShallow } from "zustand/shallow";
import type { Category } from "../interfaces";

interface CategoryButtonsActionsProps {
  category: Category;
}

/**
 * Componente de botones de acción para cada categoría
 * Incluye editar y eliminar con confirmación
 */
export const CategoryButtonsActions = ({ category }: CategoryButtonsActionsProps) => {
  const setOpenModalUpdate = useCategoryStore(useShallow((state) => state.setOpenModalUpdate));
  const { deleteCategoryMutation } = useDeleteCategory();

  const handleEdit = () => {
    setOpenModalUpdate(category);
  };

  const handleDelete = async () => {
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
  };

  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="flex space-x-2">
        <button 
          onClick={handleEdit}
          className="text-blue-600 hover:text-blue-900 transition-colors"
          aria-label="Editar categoría"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={handleDelete}
          className="text-red-600 hover:text-red-900 transition-colors"
          aria-label="Eliminar categoría"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
  );
};

