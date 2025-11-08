import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockMovement } from "../services/stock-movement.service";
import { useQuerys } from "../const";
import type { StockMovementFormData } from "../interfaces";
import { productsQueries } from "@/coquitos-features/products/const";
import Swal from "sweetalert2";

/**
 * Hook para crear un nuevo movimiento de stock
 * Invalida las queries de stock movements y products al completarse
 */
export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();

  const useCreateStockMovementMutation = useMutation({
    mutationFn: (stockMovementData: StockMovementFormData) => createStockMovement(stockMovementData),
    
    onSuccess: async (data) => {
      // Invalidar y refetch INMEDIATO de TODAS las queries de productos
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: useQuerys.allStockMovements }),
        queryClient.invalidateQueries({ queryKey: productsQueries.allProducts }),
        queryClient.refetchQueries({ queryKey: productsQueries.allProducts }),
      ]);
      
      Swal.fire({
        title: '¡Movimiento de stock registrado exitosamente!',
        text: `Nuevo stock: ${data.newStock} unidades`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },
    
    onError: (error: Error) => {
      
      Swal.fire({
        title: 'Error al registrar movimiento de stock',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },
  });

  return {
    useCreateStockMovementMutation,
    isPending: useCreateStockMovementMutation.isPending,
  };
};

