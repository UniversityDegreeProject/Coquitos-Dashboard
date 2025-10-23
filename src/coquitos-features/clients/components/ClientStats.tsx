import { useTheme } from "@/shared/hooks/useTheme";
import { Users, Crown, UserCheck, User } from 'lucide-react';
import type { Client } from '../interfaces';

interface ClientStatsProps {
  clients: Client[];
}

/**
 * Componente de estadísticas para clientes
 * Muestra: Total, VIP, Regular, Ocasional
 */
export const ClientStats = ({ clients }: ClientStatsProps) => {
  const { colors, isDark } = useTheme();

  // * Calcular estadísticas
  const totalClients = clients.length;
  const vipClients = clients.filter(c => c.type === 'VIP').length;
  const regularClients = clients.filter(c => c.type === 'Regular').length;
  const ocasionalClients = clients.filter(c => c.type === 'Ocasional').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Clientes */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Total Clientes
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {totalClients}
            </p>
          </div>
          <Users className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
      </div>

      {/* VIP */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Clientes VIP
            </p>
            <p className={`text-2xl font-bold text-yellow-600`}>
              {vipClients}
            </p>
          </div>
          <Crown className={`w-8 h-8 text-yellow-600`} />
        </div>
      </div>

      {/* Regular */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Regular
            </p>
            <p className={`text-2xl font-bold text-blue-600`}>
              {regularClients}
            </p>
          </div>
          <UserCheck className={`w-8 h-8 text-blue-600`} />
        </div>
      </div>

      {/* Ocasional */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Ocasional
            </p>
            <p className={`text-2xl font-bold text-gray-600`}>
              {ocasionalClients}
            </p>
          </div>
          <User className={`w-8 h-8 text-gray-600`} />
        </div>
      </div>
    </div>
  );
};