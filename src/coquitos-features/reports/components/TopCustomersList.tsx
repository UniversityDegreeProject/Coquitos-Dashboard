import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency, formatPercentage } from "@/shared/reports";
import type { CustomersReport } from "../interfaces";

interface TopCustomersListProps {
  report: CustomersReport;
}

/**
 * Componente para mostrar la lista de mejores clientes
 */
export const TopCustomersList = ({ report }: TopCustomersListProps) => {
  const { isDark } = useTheme();

  if (report.customers.length === 0) {
    return (
      <div
        className={`rounded-lg p-6 shadow-sm border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
          Mejores Clientes
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-500"}>No hay clientes para mostrar</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-6 shadow-sm border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      }`}
    >
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
        Mejores Clientes
      </h2>
      <div className="space-y-3">
        {report.customers.map((customer, index) => (
          <div
            key={customer.customerId}
            className={`flex items-center justify-between py-3 border-b ${
              isDark ? "border-slate-700" : "border-gray-100"
            } last:border-b-0`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <span className={`font-semibold text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {index + 1}
                </span>
              </div>
              <div>
                <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-800"}`}>
                  {customer.customerName}
                </p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {customer.totalOrders} órdenes
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                {formatCurrency(customer.totalSpent)}
              </span>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {formatPercentage(customer.percentage)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

