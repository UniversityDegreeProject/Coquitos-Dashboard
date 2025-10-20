import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { SkeletonLoader } from "@/shared/loaders-Skeleton";
import { userTableSkeletonColumns } from "../const/userTableSkeleton";

/**
 * Componente reutilizable de skeleton loader para la tabla de usuarios
 * Muestra un estado de carga elegante mientras se obtienen los datos
 */
export const UserTableSkeleton = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Usuario
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Email
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Rol
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Estado
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} divide-y ${isDark ? 'divide-[#334155]' : 'divide-gray-200'}`}>
            <SkeletonLoader
              rows={5}
              columns={userTableSkeletonColumns}
              showAvatar={true}
              animated={true}
              isDark={isDark}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
});

