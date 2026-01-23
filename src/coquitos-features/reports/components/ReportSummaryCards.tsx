import { TrendingUp, PieChart, CreditCard, Users } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "@/shared/reports";
import type { SalesReport } from "../interfaces";

interface ReportSummaryCardsProps {
  report: SalesReport;
}

/**
 * Componente para mostrar las tarjetas de resumen del reporte de ventas
 */
export const ReportSummaryCards = ({ report }: ReportSummaryCardsProps) => {
  const { isDark } = useTheme();

  const cards = [
    {
      title: "Ventas Totales",
      value: formatCurrency(report.totalSales),
      icon: TrendingUp,
      color: "green",
      bgColor: isDark ? "bg-green-900/20" : "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Órdenes",
      value: report.totalOrders.toString(),
      icon: PieChart,
      color: "blue",
      bgColor: isDark ? "bg-blue-900/20" : "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Ticket Promedio",
      value: formatCurrency(report.averageTicket),
      icon: CreditCard,
      color: "orange",
      bgColor: isDark ? "bg-orange-900/20" : "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Métodos de Pago",
      value: "2",
      icon: Users,
      color: "purple",
      bgColor: isDark ? "bg-purple-900/20" : "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`rounded-lg p-6 shadow-sm border ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-4">
              <p
                className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {card.title}
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
