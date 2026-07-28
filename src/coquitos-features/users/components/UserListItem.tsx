import { memo, useMemo, useEffect } from "react";
import { UserCheck } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import { UserButtonsActions } from "./UserButtonsActions";
import { formateDatetime, getRoleColor, getStatusColor } from "../helpers";
import { useUserStore } from "../store/user.store";
import type { SearchUsersParams, User } from "../interfaces";
import { cn } from "@/lib/utils";

interface UserListItemProps {
  user: User;
  currentParams: SearchUsersParams;
  onPageEmpty?: () => void;
}

export const UserListItem = memo(
  ({ user, currentParams, onPageEmpty }: UserListItemProps) => {
    const { isDark } = useTheme();
    const pendingEmailVerifications = useUserStore(
      useShallow((state) => state.pendingEmailVerifications),
    );
    const removePendingEmailVerification = useUserStore(
      useShallow((state) => state.removePendingEmailVerification),
    );

    const formattedLastConnection = useMemo(() => {
      if (!user.lastConnection) return "Nunca";
      return formateDatetime(user.lastConnection);
    }, [user.lastConnection]);

    useEffect(() => {
      if (user.emailVerified && pendingEmailVerifications.has(user.id!)) {
        removePendingEmailVerification(user.id!);
      }
    }, [
      user.emailVerified,
      user.id,
      pendingEmailVerifications,
      removePendingEmailVerification,
    ]);

    return (
      <div
        className={cn(
          "rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200",
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100",
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Info principal */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "text-base sm:text-lg font-semibold mb-1 truncate",
                  isDark ? "text-[#F8FAFC]" : "text-gray-800",
                )}
              >
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                <p className={isDark ? "text-[#94A3B8]" : "text-gray-600"}>
                  @{user.username}
                </p>
                <span className={isDark ? "text-[#64748B]" : "text-gray-400"}>
                  •
                </span>
                <p
                  className={cn(
                    "truncate",
                    isDark ? "text-[#94A3B8]" : "text-gray-600",
                  )}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Meta + acciones: siempre visibles */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:flex-nowrap lg:flex-shrink-0">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}
            >
              {user.role}
            </span>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}
            >
              {user.status}
            </span>

            <div className="min-w-[120px]">
              <p
                className={`text-xs ${isDark ? "text-[#64748B]" : "text-gray-400"}`}
              >
                Última conexión
              </p>
              <p
                className={`text-sm ${isDark ? "text-[#94A3B8]" : "text-gray-500"}`}
              >
                {formattedLastConnection}
              </p>
            </div>

            <UserButtonsActions
              user={user}
              currentParams={currentParams}
              onPageEmpty={onPageEmpty}
            />
          </div>
        </div>
      </div>
    );
  },
);
