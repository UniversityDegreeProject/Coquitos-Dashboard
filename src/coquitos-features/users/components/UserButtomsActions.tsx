import { Edit2, Trash2, MailCheck, Eye, KeyRound, Loader2 } from "lucide-react";
import { type User } from "../interfaces";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../store/user.store";
import Swal from "sweetalert2";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useShallow } from "zustand/shallow";
import { useSendVerificationEmail } from "../hooks/useSendVerificationEmail";
import { paths } from "@/router/paths";
import { useSentChangePassword } from "../hooks/useSentChangePassword";


interface UserButtomsActionsProps {
  user: User;
}

export const UserButtomsActions = ({ user }: UserButtomsActionsProps) => {
  const navigate = useNavigate();
  const setOpenModalUpdate = useUserStore(useShallow((state) => state.setOpenModalUpdate));
  const { deleteUserMutation } = useDeleteUser();

  // * Email verification polling state
  const usersInPolling = useUserStore(useShallow((state) => state.usersInPolling));
  const { sendVerificationEmailMutation, isPending: isSendingVerificationEmail } = useSendVerificationEmail();
  const isThisUserInPolling = usersInPolling.has(user.id!);
  
  // * Password
  const { useQuerySendChangePassword, isPending } = useSentChangePassword();
  
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

  const handleSeeMore = useCallback (() => {
    navigate(paths.dashboard.userDetail(user.id!));
  }, [user.id, navigate]);

  const handleChangePassword = useCallback (() => {
    useQuerySendChangePassword.mutate(user.email);
  }, [user.email, useQuerySendChangePassword]);

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
        {/* Enviar verificación solo si el usuario no ha verificado su email */}
        {
          !user.emailVerified && (
            <button
            className="text-blue-600 hover:text-blue-800"
            aria-label="Enviar verificación"
            title="Enviar verificación"
            type="button"
            onClick={handleSendVerification}
            disabled={isThisUserInPolling}
          >
           {isSendingVerificationEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <MailCheck className={`w-4 h-4 ${isThisUserInPolling ? 'animate-pulse'  : ''}`} />}
          </button>
          )
        }
        
        <button
          className="text-green-600 hover:text-green-900"
          aria-label="Cambiar contraseña"
          title="Cambiar contraseña"
          type="button"
          onClick={handleChangePassword}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          
        </button>
        <button
          className="text-gray-500 hover:text-gray-800"
          aria-label="Ver más detalle"
          title="Ver más detalle"
          type="button"
          onClick={handleSeeMore}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </td>
  );
};
