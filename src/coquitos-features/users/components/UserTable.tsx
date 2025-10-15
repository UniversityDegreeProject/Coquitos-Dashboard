import { memo } from "react";
import { type User } from "../interfaces";
import { UserItem } from "./UserItem";
import { SkeletonLoader } from "@/shared/loaders-Skeleton";
import { userTableSkeletonColumns } from "../const/userTableSkeleton";
import { useTheme } from "@/shared/hooks/useTheme";

interface UserTableProps {
  users: User[];
  isPending: boolean;
}

export const UserTable = memo(({ users, isPending }: UserTableProps) => {
  const { isDark } = useTheme();

  return (
    <table className="w-full">
      <thead className={`${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'}`}>
        <tr>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Usuario
          </th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Rol
          </th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Estado
          </th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Último Acceso
          </th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} divide-y ${isDark ? 'divide-[#334155]' : 'divide-gray-200'}`}>
        {isPending ? (
          <SkeletonLoader 
            rows={5} 
            columns={userTableSkeletonColumns}
            showAvatar={true}
            animated={true}
            isDark={isDark}
          />
        ) : (
          users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))
        )}
      </tbody>
    </table>
  );
});
