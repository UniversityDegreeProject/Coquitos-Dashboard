import { memo, useMemo } from "react";
import { Users, CheckCircle, XCircle, Shield } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { User } from "../interfaces";

interface UserStatsProps {
  users: User[];
}

/**
 * Componente que muestra estadísticas de usuarios
 * Diseño consistente con ProductStats y CategoryStats
 */
export const UserStats = memo(({ users }: UserStatsProps) => {
  const { colors, isDark } = useTheme();

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(user => user.status === 'Activo').length;
    const inactive = users.filter(user => user.status === 'Inactivo' || user.status === 'Suspendido').length;
    const admins = users.filter(user => user.role === 'Administrador').length;

    return { total, active, inactive, admins };
  }, [users]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Usuarios */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Total Usuarios
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {stats.total}
            </p>
          </div>
          <Users className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
      </div>

      {/* Activos */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Activos
            </p>
            <p className={`text-2xl font-bold text-green-600`}>
              {stats.active}
            </p>
          </div>
          <CheckCircle className={`w-8 h-8 text-green-600`} />
        </div>
      </div>

      {/* Inactivos/Suspendidos */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Inactivos
            </p>
            <p className={`text-2xl font-bold text-red-600`}>
              {stats.inactive}
            </p>
          </div>
          <XCircle className={`w-8 h-8 text-red-600`} />
        </div>
      </div>

      {/* Administradores */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Administradores
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {stats.admins}
            </p>
          </div>
          <Shield className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
      </div>
    </div>
  );
});

