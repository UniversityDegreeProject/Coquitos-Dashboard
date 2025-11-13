import { useState, useMemo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import {
  useGetSalesReport,
  useGetProductsReport,
  useGetCustomersReport,
} from "../hooks";
import {
  ReportFilters,
  ReportSummaryCards,
  PaymentMethodsChart,
  SalesByHourChart,
  TopProductsList,
  TopCustomersList,
  ReportLoader,
} from "../components";

/**
 * Página principal de Reportes
 * Muestra reportes de ventas, productos y clientes usando datos reales
 */
export const ReportPage = () => {
  const { isDark } = useTheme();
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("today");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Función helper para formatear fecha local a YYYY-MM-DD sin problemas de zona horaria
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Calcular fechas según el rango seleccionado
  const dateParams = useMemo(() => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (dateRange) {
      case "today":
        // Usar la fecha de hoy en hora local
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        start.setDate(today.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "custom":
        if (startDate && endDate) {
          return {
            startDate: startDate,
            endDate: endDate,
          };
        }
        return null;
    }

    return {
      startDate: formatLocalDate(start),
      endDate: formatLocalDate(end),
    };
  }, [dateRange, startDate, endDate]);

  // Hooks para obtener reportes
  const {
    report: salesReport,
    isLoading: isLoadingSales,
    error: salesError,
  } = useGetSalesReport(
    dateParams || { startDate: "", endDate: "" },
    !!dateParams
  );

  const {
    report: productsReport,
    isLoading: isLoadingProducts,
  } = useGetProductsReport(
    dateParams ? { ...dateParams, limit: 10 } : { startDate: "", endDate: "", limit: 10 },
    !!dateParams
  );

  const {
    report: customersReport,
    isLoading: isLoadingCustomers,
  } = useGetCustomersReport(
    dateParams ? { ...dateParams, limit: 10 } : { startDate: "", endDate: "", limit: 10 },
    !!dateParams
  );

  const isLoading = isLoadingSales || isLoadingProducts || isLoadingCustomers;

  // Verificar si hay datos reales en el reporte
  const hasData = useMemo(() => {
    if (!salesReport) return false;
    // Considerar que hay datos si hay ventas o órdenes
    return salesReport.totalSales > 0 || salesReport.totalOrders > 0;
  }, [salesReport]);

  // Inicializar fechas personalizadas si no están definidas
  if (dateRange === "custom" && !startDate && !endDate) {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    setStartDate(weekAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
          Reportes y Análisis
        </h1>
      </div>

      {/* Filtros y Exportación */}
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        salesReport={salesReport}
        productsReport={productsReport}
        customersReport={customersReport}
      />

      {/* Loading State */}
      {isLoading && <ReportLoader />}

      {/* Error State */}
      {salesError && (
        <div
          className={`p-4 rounded-lg ${
            isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
          } border`}
        >
          <p className={isDark ? "text-red-400" : "text-red-600"}>
            Error al cargar reportes: {salesError instanceof Error ? salesError.message : "Error desconocido"}
          </p>
        </div>
      )}

      {/* Content */}
      {!isLoading && salesReport && hasData && (
        <>
          {/* Summary Cards */}
          <ReportSummaryCards report={salesReport} />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesByHourChart report={salesReport} />
            <PaymentMethodsChart report={salesReport} />
          </div>

          {/* Products and Customers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {productsReport && productsReport.products.length > 0 && (
              <TopProductsList report={productsReport} />
            )}
            {customersReport && customersReport.customers.length > 0 && (
              <TopCustomersList report={customersReport} />
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && (!salesReport || !hasData) && !salesError && (
        <div
          className={`p-8 rounded-lg text-center ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          } border`}
        >
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            {dateRange === "today"
              ? "No hay datos disponibles para el día de hoy. Abre la caja y registra ventas para ver los reportes."
              : "No hay datos disponibles para el rango de fechas seleccionado"}
          </p>
        </div>
      )}
    </div>
  );
};
