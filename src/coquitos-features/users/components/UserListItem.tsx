import { memo, useMemo } from "react";
import { UserCheck } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { UserButtonsActions } from "./UserButtonsActions";
import { getRoleColor, getStatusColor } from "../helpers";
import type { User } from "../interfaces";

interface UserListItemProps {
  user: User;
}

/**
 * Componente reutilizable para cada item de usuario en la lista
 * Muestra información completa con acciones integradas
 */
export const UserListItem = memo(({ user }: UserListItemProps) => {
  const { isDark } = useTheme();

  // Detectar si es una mutación optimista
  const isOptimistic = user.isOptimistic;

  // Formatear última conexión (memoizado)
  const formattedLastConnection = useMemo(() => {
    if (!user.lastConnection) return 'Nunca';
    
    return new Date(user.lastConnection).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [user.lastConnection]);

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
      {/* Layout responsive: horizontal en desktop, vertical en móvil */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-4">
        {/* Sección izquierda: Avatar + Info principal */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-6 h-6 text-white" />
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base sm:text-lg font-semibold mb-1 ${
                isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
              }`}
            >
              {user.firstName} {user.lastName}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <p
                className={`${
                  isDark ? 'text-[#94A3B8]' : 'text-gray-600'
                }`}
              >
                @{user.username}
              </p>
              <span className={isDark ? 'text-[#64748B]' : 'text-gray-400'}>•</span>
              <p
                className={`${
                  isDark ? 'text-[#94A3B8]' : 'text-gray-600'
                } truncate`}
              >
                {user.email}
              </p>
            </div>
            {/* Badges en móvil: debajo del nombre */}
            <div className="flex items-center gap-2 mt-2 sm:hidden">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                  user.role
                )}`}
              >
                {user.role}
              </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  user.status
                )}`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Sección derecha: Rol, Estado, Última conexión, Acciones (solo en desktop) */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          {/* Rol */}
          <div className="flex-shrink-0">
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </div>

          {/* Estado */}
          <div className="flex-shrink-0">
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                user.status
              )}`}
            >
              {user.status}
            </span>
          </div>

          {/* Última conexión */}
          <div className="flex-shrink-0 text-right min-w-[140px]">
            <p
              className={`text-xs ${
                isDark ? 'text-[#64748B]' : 'text-gray-400'
              }`}
            >
              Última conexión
            </p>
            <p
              className={`text-sm ${
                isDark ? 'text-[#94A3B8]' : 'text-gray-500'
              }`}
            >
              {formattedLastConnection}
            </p>
          </div>

          {/* Acciones */}
          <UserButtonsActions user={user} />
        </div>

        {/* Última conexión y acciones en móvil */}
        <div className="flex sm:hidden items-center justify-between pt-2 border-t border-gray-200 dark:border-[#334155]">
          <div className="text-left">
            <p
              className={`text-xs ${
                isDark ? 'text-[#64748B]' : 'text-gray-400'
              }`}
            >
              Última conexión
            </p>
            <p
              className={`text-sm ${
                isDark ? 'text-[#94A3B8]' : 'text-gray-500'
              }`}
            >
              {formattedLastConnection}
            </p>
          </div>
          <UserButtonsActions user={user} />
        </div>
      </div>
    </div>
  );
});

