import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../services/client.service';
import type { ClientFormData } from '../interfaces';

import { querysClient } from '../const';
import Swal from 'sweetalert2';
/**
 * Hook para crear un nuevo cliente
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  
  const useCreateClientMutation = useMutation({
    
    // TODO: IMPLEMENTAR MUTACION OPTIMISTA
    mutationFn: (clientData: ClientFormData) => createClient(clientData),
    onSuccess: () => {
      // Invalidar y refetch las queries relacionadas
      queryClient.invalidateQueries({ queryKey: querysClient.allClients });


      Swal.fire({
        title: '¡Cliente creado exitosamente!',
        text: 'El cliente se ha creado correctamente',
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
        title: 'Error al crear cliente',
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
    useCreateClientMutation,
    ...useCreateClientMutation,
  }
};
