import { useMutation } from "@tanstack/react-query"
import { changeUserPassword } from "../services/use.service"
import Swal from "sweetalert2";


export const useSentChangePassword = () => {


  const useQuerySendChangePassword =  useMutation({
    mutationFn: (email: string) => changeUserPassword(email),

    onSuccess: (_data, variables ) => {
      console.log('variables', variables);
      Swal.fire({
        title: 'Correo de cambio de contraseña enviado',
        text: `Se ha enviado un correo de cambio de contraseña a ${variables}`,
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
    onError: (error, ) => {
     
      Swal.fire({
        title: 'Error al enviar correo de cambio de contraseña',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-red-800',
          htmlContainer: 'text-gray-600',
        },
      });
    }


  });
  
  return {
    useQuerySendChangePassword,
    isPending : useQuerySendChangePassword.isPending

  };
}