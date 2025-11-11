import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeCashRegister } from "../services/cash-register.service";
import { cashRegisterQueries } from "../const";
import Swal from "sweetalert2";
import type { CloseCashRegisterFormData, CloseCashRegisterResponse } from "../interfaces";

interface UseCloseCashRegisterOptions {
  onSuccessCallback?: () => void;
}

/**
 * Hook para cerrar la caja actual
 */
export const useCloseCashRegister = (options?: UseCloseCashRegisterOptions) => {
  const { onSuccessCallback } = options || {};
  const queryClient = useQueryClient();

  const useCloseCashRegisterMutation = useMutation({
    mutationFn: (data: CloseCashRegisterFormData) => closeCashRegister(data),

    onSuccess: async (response: CloseCashRegisterResponse) => {
      const userId = response.cashRegister.userId;

      // Invalidar TODAS las queries de cash registers
      await queryClient.invalidateQueries({
        queryKey: cashRegisterQueries.allCashRegisters,
      });

      // Invalidar órdenes
      await queryClient.invalidateQueries({
        queryKey: ['orders'],
      });

      // Hacer REFETCH explícito de la caja actual del usuario
      await queryClient.refetchQueries({
        queryKey: cashRegisterQueries.currentCashRegister(userId),
      });

      // Ejecutar callback
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // SweetAlert de éxito
      await Swal.fire({
        title: '¡Caja Cerrada!',
        html: `
          <p>Caja cerrada exitosamente</p>
          <p class="text-sm text-gray-600 mt-2">
            Diferencia: ${response.cashRegister.difference?.toFixed(2)} Bs
          </p>
        `,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },

    onError: async (error: Error) => {
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      await Swal.fire({
        title: 'Error al cerrar caja',
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
    useCloseCashRegisterMutation,
    isPending: useCloseCashRegisterMutation.isPending,
  };
};

