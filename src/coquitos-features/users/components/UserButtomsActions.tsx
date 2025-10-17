import { Edit2, Trash2, MailCheck, Eye, KeyRound } from "lucide-react";
import { type User } from "../interfaces";
import { useCallback } from "react";
import { useUserStore } from "../store/user.store";
import Swal from "sweetalert2";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useShallow } from "zustand/shallow";
import { useSendVerificationEmail } from "../hooks/useSendVerificationEmail";


interface UserButtomsActionsProps {
  user: User;
}

export const UserButtomsActions = ({ user }: UserButtomsActionsProps) => {

  const setOpenModalUpdate = useUserStore(useShallow((state) => state.setOpenModalUpdate));
  const isUserInPolling = useUserStore(useShallow((state) => state.isUserInPolling));
  const { deleteUserMutation } = useDeleteUser();
  const { sendVerificationEmailMutation } = useSendVerificationEmail();
  
  const isThisUserInPolling = isUserInPolling(user.id!);
  
  const handleDeleteUser = useCallback (() => {
    Swal.fire({
      title: '¿Estás seguro de querer eliminar este usuario?',
      text: `El usuario ${user.username} se eliminará permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(user.id!);
      }
    });
  }, [user, deleteUserMutation]);

  const handleEditUser = useCallback (() => {
    setOpenModalUpdate(user);
  }, [user, setOpenModalUpdate]);

  const handleSendVerification = useCallback (() => {
    sendVerificationEmailMutation.mutate({
      email: user.email,
      userId: user.id!
    });
  }, [user, sendVerificationEmailMutation]);

  // const handleChangePassword = useCallback (() => {
  //   console.log('change password');
  // }, []);

  // const handleSeeMore = useCallback (() => {
  //   // TODO -> ir a la pagina exclusiva
  // }, []);
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
      <div className="flex space-x-2">
        <button
          className="text-indigo-600 hover:text-indigo-900"
          aria-label="Editar usuario"
          title="Editar usuario"
          type="button"
          onClick={handleEditUser}
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          className="text-red-600 hover:text-red-900"
          aria-label="Eliminar usuario"
          title="Eliminar usuario"
          type="button"
          onClick={handleDeleteUser}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          className="text-blue-600 hover:text-blue-800"
          aria-label="Enviar verificación"
          title="Enviar verificación"
          type="button"
          onClick={handleSendVerification}
          disabled={isThisUserInPolling}
        >
          <MailCheck className={`w-4 h-4 ${isThisUserInPolling ? 'animate-pulse' : ''}`} />
        </button>
        <button
          className="text-green-600 hover:text-green-900"
          aria-label="Cambiar contraseña"
          title="Cambiar contraseña"
          type="button"
        >
          <KeyRound className="w-4 h-4" />
        </button>
        <button
          className="text-gray-500 hover:text-gray-800"
          aria-label="Ver más detalle"
          title="Ver más detalle"
          type="button"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </td>
  );
};
