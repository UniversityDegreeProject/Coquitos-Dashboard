import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openCashRegister } from "../services/cash-register.service";
import { cashRegisterQueries } from "../const";
import Swal from "sweetalert2";
import type { OpenCashRegisterFormData, OpenCashRegisterResponse } from "../interfaces";

interface UseOpenCashRegisterOptions {
  onSuccessCallback?: () => void;
}

/**
 * Hook para abrir una nueva caja
 */
export const useOpenCashRegister = (options?: UseOpenCashRegisterOptions) => {
  const { onSuccessCallback } = options || {};
  const queryClient = useQueryClient();

  const useOpenCashRegisterMutation = useMutation({
    mutationFn: (data: OpenCashRegisterFormData) => openCashRegister(data),

    onSuccess: async (response: OpenCashRegisterResponse) => {
      const userId = response.cashRegister.userId;

      // Invalidar TODAS las queries de cash registers
      await queryClient.invalidateQueries({
        queryKey: cashRegisterQueries.allCashRegisters,
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
        title: '¡Caja Abierta!',
        text: `Caja abierta exitosamente con ${response.cashRegister.openingAmount} Bs`,
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
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      await Swal.fire({
        title: 'Error al abrir caja',
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
    useOpenCashRegisterMutation,
    isPending: useOpenCashRegisterMutation.isPending,
  };
};

