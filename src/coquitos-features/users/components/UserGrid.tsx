import { memo } from "react";
import { type User } from "../interfaces";
import { UserTable } from "./UserTable";
import { useTheme } from "@/shared/hooks/useTheme";

interface UserGridProps {
  users: User[];
  isPending: boolean;
}

export const UserGrid = memo(({ users, isPending }: UserGridProps) => {
  const { isDark } = useTheme();

  console.log('re-render UserGrid');

  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-lg shadow-sm border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <h2 className={`text-lg font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
          Lista de Usuarios
        </h2>
      </div>
      <div className="overflow-x-auto">
        <UserTable users={users} isPending={isPending} />
      </div>
    </div>
  );
});
