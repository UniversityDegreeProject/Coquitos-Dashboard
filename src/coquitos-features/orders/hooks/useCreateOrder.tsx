import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../services/order.service";
import { ordersQueries } from "../const";
import Swal from "sweetalert2";
import type { CreateOrderResponse, OrderFormData } from "../interfaces";
import { productsQueries } from "@/coquitos-features/products/const";
import { cashRegisterQueries } from "@/coquitos-features/cash-closing/const";

interface UseCreateOrderOptions {
  onSuccessCallback?: () => void;
}

/**
 * Hook para crear una nueva orden (venta)
 * Invalida productos y stock movements automáticamente
 */
export const useCreateOrder = (options?: UseCreateOrderOptions) => {
  const { onSuccessCallback } = options || {};
  const queryClient = useQueryClient();

  const useCreateOrderMutation = useMutation({
    mutationFn: (orderData: OrderFormData) => createOrder(orderData),

    onSuccess: async (response: CreateOrderResponse) => {
      // Invalidar queries relacionadas
      await queryClient.invalidateQueries({
        queryKey: ordersQueries.allOrders,
      });

      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });

      await queryClient.invalidateQueries({
        queryKey: ['stock-movements'],
      });

      // Invalidar queries de cash-register para reflejar los cambios en el cierre de caja
      await queryClient.invalidateQueries({
        queryKey: cashRegisterQueries.allCashRegisters,
      });

      // Ejecutar callback de éxito
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // SweetAlert de éxito
      await Swal.fire({
        title: '¡Venta Registrada!',
        text: `Orden ${response.order.orderNumber} creada exitosamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
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
        title: 'Error al registrar venta',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Entendido',
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
    useCreateOrderMutation,
    isPending: useCreateOrderMutation.isPending,
  };
};

