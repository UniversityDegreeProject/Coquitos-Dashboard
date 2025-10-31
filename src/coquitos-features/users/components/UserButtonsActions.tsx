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
import type { User } from "../interfaces";

interface UserButtonsActionsProps {
  user: User;
}

/**
 * Componente de botones de acción para cada usuario
 * Incluye: editar, eliminar, enviar verificación, cambiar contraseña, ver detalle
 * Optimizado con memoización
 */
export const UserButtonsActions = memo(({ user }: UserButtonsActionsProps) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const setOpenModalUpdate = useUserStore(useShallow((state) => state.setOpenModalUpdate));
  const { deleteUserMutation } = useDeleteUser();

  // Email verification polling state
  const { sendVerificationEmailMutation, isPending: isSendingVerificationEmail } = useSendVerificationEmail();
  
  // Password
  const { useQuerySendChangePassword, isPending: isSendingPassword } = useSentChangePassword();
  
  // Memoizar handlers
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
        deleteUserMutation.mutate(user.id!);
      }
    });
  }, [user.username, user.id, deleteUserMutation]);

  const handleEditUser = useCallback(() => {
    setOpenModalUpdate(user);
  }, [user, setOpenModalUpdate]);

  const handleSendVerification = useCallback(() => {
    sendVerificationEmailMutation.mutate({
      email: user.email,
      userId: user.id!
    });
  }, [user.email, user.id, sendVerificationEmailMutation]);

  const handleSeeMore = useCallback(() => {
    navigate(paths.dashboard.userDetail(user.id!));
  }, [user.id, navigate]);

  const handleChangePassword = useCallback(() => {
    useQuerySendChangePassword.mutate(user.email);
  }, [user.email, useQuerySendChangePassword]);

  return (
    <div className="flex space-x-2 flex-shrink-0">
      {/* Editar */}
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

      {/* Eliminar */}
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

      {/* Enviar verificación (solo si no está verificado) */}
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
        >
          {isSendingVerificationEmail ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MailCheck className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Cambiar contraseña */}
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

      {/* Ver más detalle */}
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
