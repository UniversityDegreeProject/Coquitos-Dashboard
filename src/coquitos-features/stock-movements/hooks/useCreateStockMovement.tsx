import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createStockMovement } from "../services/stock-movement.service";
import { useQuerys as stockMovementQuerys } from "../const";
import type { StockMovementFormData } from "../interfaces";
import { useQuerys as productQuerys } from "@/coquitos-features/products/const";

/**
 * Hook para crear un nuevo movimiento de stock
 * Invalida las queries de stock movements y products al completarse
 */
export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();

  const useCreateStockMovementMutation = useMutation({
    mutationFn: (stockMovementData: StockMovementFormData) => createStockMovement(stockMovementData),
    
    onSuccess: (data) => {
      // Invalidar queries para refrescar los datos
      queryClient.invalidateQueries({ queryKey: stockMovementQuerys.allStockMovements });
      queryClient.invalidateQueries({ queryKey: productQuerys.allProducts });
      
      toast.success(`Movimiento de stock registrado exitosamente`, {
        description: `Nuevo stock: ${data.newStock} unidades`,
      });
    },
    
    onError: (error: Error) => {
      toast.error('Error al registrar movimiento de stock', {
        description: error.message,
      });
    },
  });

  return {
    useCreateStockMovementMutation,
    isPending: useCreateStockMovementMutation.isPending,
  };
};

