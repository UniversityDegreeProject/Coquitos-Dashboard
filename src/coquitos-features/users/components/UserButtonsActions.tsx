import { memo, useCallback } from "react";
import { Edit2, Trash2, MailCheck, Eye, KeyRound, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import { useUserStore } from "../store/user.store";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useSendVerificationEmail } from "../hooks/useSendVerificationEmail";
import { useSentChangePassword } from "../hooks/useSentChangePassword";
import { paths } from "@/router/paths";
import type { User, SearchUsersParams } from "../interfaces";

interface UserButtonsActionsProps {
  user: User;
  currentParams: SearchUsersParams;
  onPageEmpty?: () => void;
}

export const UserButtonsActions = memo(({ user, currentParams, onPageEmpty }: UserButtonsActionsProps) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const setOpenModalUpdate = useUserStore(useShallow((state) => state.setOpenModalUpdate));
  const pendingEmailVerifications = useUserStore(useShallow((state) => state.pendingEmailVerifications));
  const addPendingEmailVerification = useUserStore(useShallow((state) => state.addPendingEmailVerification));
  const setIsMutating = useUserStore(useShallow((state) => state.setIsMutating));
  
  // Pasar parámetros actuales al hook
  const { deleteUserMutation } = useDeleteUser({ 
    currentParams,
    onPageEmpty,
    onFinally: () => setIsMutating(false)
  });

  const { sendVerificationEmailMutation, isPending: isSendingVerificationEmail } = useSendVerificationEmail();
  const { useQuerySendChangePassword, isPending: isSendingPassword } = useSentChangePassword();
  
  const handleDeleteUser = useCallback(() => {
    Swal.fire({
      title: '¿Estás seguro de querer eliminar este usuario?',
      text: `El usuario ${user.username} se eliminará permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsMutating(true);
        deleteUserMutation.mutate(user.id!);
      }
    });
  }, [user.username, user.id, deleteUserMutation, setIsMutating]);

  // * Handler para editar usuario
  const handleEditUser = useCallback(() => {
    setOpenModalUpdate(user);
  }, [user, setOpenModalUpdate]);

  // * Handler para enviar verificación de email
  const handleSendVerification = useCallback(() => {
    addPendingEmailVerification(user.id!);
    
    sendVerificationEmailMutation.mutate({
      email: user.email,
      userId: user.id!
    });
  }, [user.email, user.id, sendVerificationEmailMutation, addPendingEmailVerification]);

  // * Handler para ver más detalle
  const handleSeeMore = useCallback(() => {
    navigate(paths.dashboard.userDetail(user.id!));
  }, [user.id, navigate]);

  // * Handler para cambiar contraseña
  const handleChangePassword = useCallback(() => {
    useQuerySendChangePassword.mutate(user.email);
  }, [user.email, useQuerySendChangePassword]);

  return (
    <div className="flex space-x-2 flex-shrink-0">
      <button
        onClick={handleEditUser}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-blue-400 hover:bg-blue-500/10 hover:text-blue-300'
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
        }`}
        aria-label="Editar usuario"
        title="Editar usuario"
        type="button"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      <button
        onClick={handleDeleteUser}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
        }`}
        aria-label="Eliminar usuario"
        title="Eliminar usuario"
        type="button"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {!user.emailVerified && (
        <button
          onClick={handleSendVerification}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isDark
              ? 'text-green-400 hover:bg-green-500/10 hover:text-green-300'
              : 'text-green-600 hover:bg-green-50 hover:text-green-700'
          } disabled:opacity-50`}
          aria-label="Enviar verificación"
          title="Enviar verificación"
          type="button"
          disabled={isSendingVerificationEmail}
        >
          {isSendingVerificationEmail ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MailCheck 
              className={`w-4 h-4 transition-all duration-300 ${
                pendingEmailVerifications.has(user.id!) && !user.emailVerified 
                  ? 'animate-pulse opacity-80' 
                  : ''
              }`} 
            />
          )}
        </button>
      )}

      <button
        onClick={handleChangePassword}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-purple-400 hover:bg-purple-500/10 hover:text-purple-300'
            : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
        }`}
        aria-label="Cambiar contraseña"
        title="Cambiar contraseña"
        type="button"
      >
        {isSendingPassword ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <KeyRound className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={handleSeeMore}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-gray-400 hover:bg-gray-500/10 hover:text-gray-300'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
        }`}
        aria-label="Ver más detalle"
        title="Ver más detalle"
        type="button"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  );
});