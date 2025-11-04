import { memo, useCallback, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Category, SearchCategoriesParams } from "../interfaces";
import { useCategoryStore } from "../store/category.store";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";

interface CategoryButtonsActionsProps {
  category: Category;
  currentParams: SearchCategoriesParams;
  onPageEmpty?: () => void;
}

export const CategoryButtonsActions = memo(({ category, currentParams, onPageEmpty }: CategoryButtonsActionsProps) => {
  const { isDark } = useTheme();
  const setOpenModalUpdate = useCategoryStore(useShallow((state) => state.setOpenModalUpdate));
  const setIsMutation = useCategoryStore(useShallow((state) => state.setIsMutation));

  
  //* Estado local para el switch 
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const categoryMessageState = isTogglingStatus && "El estado de la categoría se ha cambiado correctamente";
  
  //* Pasar parámetros actuales al hook
  const { deleteCategoryMutation } = useDeleteCategory({ 
    currentParams,
    onPageEmpty,
    onFinally: () => setIsMutation(false)
  });

  //* Hook para actualizar categoría
  const { updateCategoryMutation } = useUpdateCategory({
    currentParams,
    categoryMessageState: categoryMessageState || "",
    onFinally: () => {
      setIsMutation(false);
      setIsTogglingStatus(false);
    }
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

  // * Handler para editar categoría
  const handleEditCategory = useCallback(() => {
    setOpenModalUpdate(category);
  }, [category, setOpenModalUpdate]);

  // * Handler para cambiar el estado de la categoría (Activo/Inactivo)
  const handleToggleStatus = useCallback(() => {
    const newStatus = category.status === "Activo" ? "Inactivo" : "Activo";
    
    setIsMutation(false);
    setIsTogglingStatus(true);


    const categoryCopy = { ...category };
    delete categoryCopy.updatedAt;
    delete categoryCopy.createdAt;
    
    //* Actualizar solo el estado de la categoría
    updateCategoryMutation.mutate({
      ...categoryCopy,
      status: newStatus
    });
  }, [category, updateCategoryMutation, setIsMutation]);
 




  //* Estado actual de la categoría una vez que se cambie
  const isActive = category.status === "Activo";

  return (
    <div className="flex items-end space-x-3 flex-shrink-0">
      {/* Botón Editar */}
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

      {/* Botón Eliminar */}
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

      {/* Switch de Estado - Alineado verticalmente */}
      <div className="flex flex-col items-center space-y-1 flex-shrink-0">
        <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'} whitespace-nowrap`}>
          Estado
        </p>
        <button
          onClick={handleToggleStatus}
          disabled={isTogglingStatus}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isActive
              ? 'bg-green-500 focus:ring-green-500'
              : isDark 
                ? 'bg-gray-600 focus:ring-gray-500' 
                : 'bg-gray-300 focus:ring-gray-400'
          } ${isTogglingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
          aria-label={`Cambiar estado de categoría a ${isActive ? 'Inactivo' : 'Activo'}`}
          title={`Estado: ${category.status}. Click para cambiar`}
          type="button"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
              isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
});

CategoryButtonsActions.displayName = 'CategoryButtonsActions';