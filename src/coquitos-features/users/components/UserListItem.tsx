import { memo, useMemo, useEffect } from "react";
import { UserCheck } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import { UserButtonsActions } from "./UserButtonsActions";
import { formateDatetime, getRoleColor, getStatusColor } from "../helpers";
import { useUserStore } from "../store/user.store";
import type { SearchUsersParams, User } from "../interfaces";

interface UserListItemProps {
  user: User;
  currentParams: SearchUsersParams;
  onPageEmpty?: () => void;
}

export const UserListItem = memo(({ user, currentParams, onPageEmpty }: UserListItemProps) => {
  const { isDark } = useTheme();
  const pendingEmailVerifications = useUserStore(useShallow((state) => state.pendingEmailVerifications));
  const removePendingEmailVerification = useUserStore(useShallow((state) => state.removePendingEmailVerification));

  const isOptimistic = user.isOptimistic;

  const formattedLastConnection = useMemo(() => {
    if( !user.lastConnection ) return "Nunca";
    return formateDatetime(user.lastConnection );
  }, [user.lastConnection]);

  // Efecto para limpiar el estado cuando el email es verificado
  useEffect(() => {
    if (user.emailVerified && pendingEmailVerifications.has(user.id!)) {
      removePendingEmailVerification(user.id!);
    }
  }, [user.emailVerified, user.id, pendingEmailVerifications, removePendingEmailVerification]);

  return (
    <div
      className={`${
        isDark ? 'bg-[#1E293B]' : 'bg-white'
      } rounded-xl shadow-lg border ${
        isDark ? 'border-[#334155]' : 'border-gray-100'
      } p-4 hover:shadow-xl transition-all duration-200 ${
        isOptimistic ? 'animate-pulse opacity-60' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:space-x-4">
        {/* Sección izquierda: Avatar + Info principal */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base sm:text-lg font-semibold mb-1 ${
                isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
              }`}
            >
              {user.firstName} {user.lastName}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                @{user.username}
              </p>
              <span className={isDark ? 'text-[#64748B]' : 'text-gray-400'}>•</span>
              <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:hidden">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Sección derecha: Desktop */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0 self-center">
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>

          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
              {user.status}
            </span>
          </div>

          <div className="flex-shrink-0 text-right min-w-[140px]">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Última conexión
            </p>
            <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {formattedLastConnection}
            </p>
          </div>

          {/* Pasar el callback */}
          <UserButtonsActions user={user} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>

        {/* Móvil */}
        <div className="flex sm:hidden items-center justify-between pt-2 border-t border-gray-200 dark:border-[#334155]">
          <div className="text-left">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Última conexión
            </p>
            <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {formattedLastConnection}
            </p>
          </div>
          {/* Pasar el callback */}
          <UserButtonsActions user={user} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>
      </div>
    </div>
  );
});