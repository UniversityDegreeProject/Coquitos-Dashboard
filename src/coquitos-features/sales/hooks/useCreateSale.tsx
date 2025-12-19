import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "../services/sale.service";
import { salesQueries } from "../const";
import Swal from "sweetalert2";
import type { CreateSaleResponse, SaleFormData } from "../interfaces";
import { productsQueries } from "@/coquitos-features/products/const";
import { cashRegisterQueries } from "@/coquitos-features/cash-closing/const";

interface UseCreateSaleOptions {
  onSuccessCallback?: () => void;
}

/**
 * Hook para crear una nueva venta
 * Invalida productos y stock movements automáticamente
 */
export const useCreateSale = (options?: UseCreateSaleOptions) => {
  const { onSuccessCallback } = options || {};
  const queryClient = useQueryClient();

  const useCreateSaleMutation = useMutation({
    mutationFn: (saleData: SaleFormData) => createSale(saleData),

    onSuccess: async (response: CreateSaleResponse) => {
      // Invalidar y refrescar queries relacionadas inmediatamente
      await Promise.all([
        // Invalidar y refrescar ventas
        queryClient.invalidateQueries({
          queryKey: salesQueries.allSales,
          refetchType: "active",
        }),
        // Invalidar y refrescar productos - forzar refetch inmediato
        queryClient.invalidateQueries({
          queryKey: productsQueries.allProducts,
          refetchType: "all",
        }),
        // Refrescar productos activos inmediatamente
        queryClient.refetchQueries({
          queryKey: productsQueries.allProducts,
          type: "active",
        }),
        // Invalidar y refrescar movimientos de stock
        queryClient.invalidateQueries({
          queryKey: ["stock-movements"],
          refetchType: "active",
        }),
        // Invalidar y refrescar caja
        queryClient.invalidateQueries({
          queryKey: cashRegisterQueries.allCashRegisters,
          refetchType: "active",
        }),
      ]);

      // Ejecutar callback de éxito
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // SweetAlert de éxito
      await Swal.fire({
        title: "¡Venta Registrada!",
        text: `Venta ${response.sale.saleNumber} creada exitosamente`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-xl",
          title: "text-xl font-bold text-gray-800",
          htmlContainer: "text-gray-600",
        },
      });
    },

    onError: async (error: Error) => {
      // Ejecutar callback incluso en error
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // SweetAlert de error
      await Swal.fire({
        title: "Error al registrar venta",
        text: error.message,
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-xl",
          title: "text-xl font-bold text-gray-800",
          htmlContainer: "text-gray-600",
        },
      });
    },
  });

  return {
    useCreateSaleMutation,
    isPending: useCreateSaleMutation.isPending,
  };
};
