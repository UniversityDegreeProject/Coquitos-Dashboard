import { memo, useMemo } from "react";
import { Users, User, Star, Timer } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface ClientStatsProps {
  totalClients: number;
  VIPClients: number;
  RegularClients: number;
  OcasionalClients: number;
}

/**
 * Componente que muestra estadísticas de clientes
 * Cada tipo de cliente tiene su propio recuadro (Regular, VIP, Ocasional)
 */
export const ClientStats = memo(
  ({
    totalClients,
    RegularClients,
    VIPClients,
    OcasionalClients,
  }: ClientStatsProps) => {
    const { colors, isDark } = useTheme();

    // Calcular estadísticas
    const stats = useMemo(
      () => ({
        total: totalClients,
        regular: RegularClients,
        VIP: VIPClients,
        occasional: OcasionalClients,
      }),
      [totalClients, RegularClients, VIPClients, OcasionalClients],
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Clientes */}
        <div
          className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
              >
                Total Clientes
              </p>
              <p className={`text-2xl font-bold ${colors.text.primary}`}>
                {stats.total}
              </p>
            </div>
            <div
              className={`p-2.5 rounded-xl ${isDark ? "bg-[#F59E0B]/10" : "bg-[#275081]/10"}`}
            >
              <Users
                className={`w-6 h-6 ${isDark ? "text-[#F59E0B]" : "text-[#275081]"}`}
              />
            </div>
          </div>
        </div>

        {/* Clientes Regulares */}
        <div
          className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
              >
                Regulares
              </p>
              <p className={`text-2xl font-bold ${colors.text.primary}`}>
                {stats.regular}
              </p>
            </div>
            <div
              className={`p-2.5 rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
            >
              <User
                className={`w-6 h-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              />
            </div>
          </div>
        </div>

        {/* Clientes VIP */}
        <div
          className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
              >
                VIP
              </p>
              <p className="text-2xl font-bold text-amber-500">{stats.VIP}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Clientes Ocasionales */}
        <div
          className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-4 shadow-sm border ${isDark ? "border-[#334155]" : "border-gray-100"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
              >
                Ocasionales
              </p>
              <p className="text-2xl font-bold text-purple-500">
                {stats.occasional}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Timer className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
