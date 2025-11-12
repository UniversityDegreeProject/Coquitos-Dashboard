import { Clock } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import {
  KPICards,
  PaymentMethodsSummary,
  TopProductsSection,
  RecentOrdersTable,
} from "../components/dashboard";

/**
 * Página principal del Dashboard
 * Muestra KPIs, gráficos y estadísticas del negocio usando datos reales
 */
export const DashboardPage = () => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
          Dashboard
        </h1>
        <div className={`flex items-center space-x-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <Clock className="w-4 h-4" />
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPIs Cards */}
      <KPICards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodsSummary />
        <TopProductsSection />
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable />
    </div>
  );
};