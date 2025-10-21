import { Edit2, Trash2, TrendingUp } from "lucide-react";
import { useCallback } from "react";
import { useProductStore } from "../store/product.store";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useShallow } from "zustand/shallow";
import Swal from "sweetalert2";
import type { ProductResponse } from "../interfaces";
import { useStockMovementStore } from "@/coquitos-features/stock-movements/store/stock-movement.store";

interface ProductItemActionsProps {
  product: ProductResponse;
}

/**
 * Componente de acciones para cada producto
 * Maneja internamente los handlers de editar y eliminar
 */
export const ProductItemActions = ({ product }: ProductItemActionsProps) => {
  const setOpenModalUpdate = useProductStore(useShallow((state) => state.setOpenModalUpdate));
  const { deleteProductMutation } = useDeleteProduct();
  const openStockModal = useStockMovementStore(useShallow((state) => state.openModal));

  const handleEditProduct = useCallback(() => {
    setOpenModalUpdate(product);
  }, [product, setOpenModalUpdate]);

  const handleAdjustStock = useCallback(() => {
    openStockModal(product);
  }, [product, openStockModal]);

  const handleDeleteProduct = useCallback(() => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-xl',
        title: 'text-xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductMutation.mutate(product.id);
      }
    });
  }, [product, deleteProductMutation]);

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleAdjustStock}
        className="p-2 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 transition-colors"
        aria-label="Ajustar stock"
        title="Ajustar stock"
        type="button"
      >
        <TrendingUp className="w-4 h-4 text-green-600" />
      </button>
      <button
        onClick={handleEditProduct}
        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
        aria-label="Editar producto"
        title="Editar producto"
        type="button"
      >
        <Edit2 className="w-4 h-4 text-blue-600" />
      </button>
      <button
        onClick={handleDeleteProduct}
        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
        aria-label="Eliminar producto"
        title="Eliminar producto"
        type="button"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
    </div>
  );
};

