import { memo, useMemo } from "react";
import { type User } from "../interfaces";
import { getRoleColor, getStatusColor } from "../helpers";
import { UserCheck } from "lucide-react";
import { UserButtomsActions } from "./UserButtomsActions";
import { useTheme } from "@/shared/hooks/useTheme";

interface UserItemProps {
  user: User;
}

export const UserItem = memo(({ user }: UserItemProps) => {
  const { isDark } = useTheme();

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

  // Detectar si es una mutación optimista
  const isOptimistic = (user as User).isOptimistic;

  return (
    <tr className={`${isDark ? 'hover:bg-[#334155]/20' : 'hover:bg-gray-50'} transition-colors ${isOptimistic ? 'animate-pulse opacity-60' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            user.status
          )}`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formattedLastConnection}
      </td>
      <UserButtomsActions user={user}/>
    </tr>
  );
});
