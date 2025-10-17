import { useMutation } from "@tanstack/react-query";
import { sendVerificationEmail } from "../services/use.service";
import Swal from "sweetalert2";
import { useUserStore } from "../store/user.store";
import { useShallow } from "zustand/shallow";

interface SendVerificationParams {
  email: string;
  userId: string;
}

/**
 * Hook para enviar email de verificación
 * Activa el polling del usuario específico mientras espera verificación
 * El polling se detiene automáticamente cuando emailVerified = true
 */
export const useSendVerificationEmail = () => { 

  const addUserToPolling = useUserStore(useShallow((state) => state.addUserToPolling));

  const sendVerificationEmailMutation = useMutation({

    mutationFn: ({ email }: SendVerificationParams) => sendVerificationEmail(email),

    onSuccess: (_data, variables: SendVerificationParams) => {
      // Agregar el usuario al polling para que empiece a parpadear
      addUserToPolling(variables.userId);
      
      Swal.fire({
        title: 'Email de verificación enviado exitosamente',
        text: `Correo de verificación enviado a ${variables.email}`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
      
      // El polling se detendrá automáticamente cuando emailVerified sea true
      // Ver: validateVerifiedUsers en UsersPage
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error al enviar email de verificación',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-red-800',
          htmlContainer: 'text-red-600',
        },
      });
    }
  });
  
  return {
    sendVerificationEmailMutation,
  }
}
