import { useMemo } from "react";
import { Calendar, FileSpreadsheet, FileText } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { SalesReport, ProductsReport, CustomersReport, CashRegisterSummaryReport, SellersReport } from "../interfaces";
import {
  generateSalesReportPDF,
  generateSalesReportExcel,
  generateProductsReportPDF,
  generateProductsReportExcel,
  generateCustomersReportPDF,
  generateCustomersReportExcel,
  generateCashRegisterSummaryPDF,
  generateCashRegisterSummaryExcel,
  generateCompleteDashboardPDF,
  generateCompleteDashboardExcel,
} from "@/shared/reports";

interface ReportFiltersProps {
  dateRange: "today" | "week" | "month" | "custom";
  onDateRangeChange: (range: "today" | "week" | "month" | "custom") => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  salesReport?: SalesReport;
  productsReport?: ProductsReport;
  customersReport?: CustomersReport;
  cashRegisterSummary?: CashRegisterSummaryReport;
  sellersReport?: SellersReport;
}

/**
 * Componente para filtros y acciones de exportación de reportes
 */
export const ReportFilters = ({
  dateRange,
  onDateRangeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  salesReport,
  productsReport,
  customersReport,
  cashRegisterSummary,
  sellersReport,
}: ReportFiltersProps) => {
  const { isDark } = useTheme();

  // Verificar si hay datos reales para exportar
  const hasDataToExport = useMemo(() => {
    if (salesReport) {
      return salesReport.totalSales > 0 || salesReport.totalOrders > 0;
    }
    if (productsReport) {
      return productsReport.products.length > 0;
    }
    if (customersReport) {
      return customersReport.customers.length > 0;
    }
    if (cashRegisterSummary) {
      return cashRegisterSummary.days.length > 0;
    }
    return false;
  }, [salesReport, productsReport, customersReport, cashRegisterSummary]);

  const handleExportPDF = async () => {
    try {
      // Si tenemos todos los reportes (salesReport, productsReport, customersReport), generar reporte completo
      if (salesReport && productsReport && customersReport) {
        await generateCompleteDashboardPDF({
          salesReport,
          productsReport,
          customersReport,
          sellersReport,
        });
      } else if (salesReport) {
        await generateSalesReportPDF(salesReport);
      } else if (productsReport) {
        await generateProductsReportPDF(productsReport);
      } else if (customersReport) {
        await generateCustomersReportPDF(customersReport);
      } else if (cashRegisterSummary) {
        await generateCashRegisterSummaryPDF(cashRegisterSummary);
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
    }
  };

  const handleExportExcel = async () => {
    try {
      // Si tenemos todos los reportes (salesReport, productsReport, customersReport), generar reporte completo
      if (salesReport && productsReport && customersReport) {
        await generateCompleteDashboardExcel({
          salesReport,
          productsReport,
          customersReport,
          sellersReport,
        });
      } else if (salesReport) {
        await generateSalesReportExcel(salesReport);
      } else if (productsReport) {
        await generateProductsReportExcel(productsReport);
      } else if (customersReport) {
        await generateCustomersReportExcel(customersReport);
      } else if (cashRegisterSummary) {
        await generateCashRegisterSummaryExcel(cashRegisterSummary);
      }
    } catch (error) {
      console.error("Error al generar Excel:", error);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg ${
      isDark ? "bg-slate-800" : "bg-white"
    } shadow-sm border ${isDark ? "border-slate-700" : "border-gray-200"}`}>
      {/* Filtros de fecha */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as "today" | "week" | "month" | "custom")}
            className={`px-3 py-2 rounded-lg border ${
              isDark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-white border-gray-300 text-gray-800"
            } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          >
            <option value="today">Hoy</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="custom">Rango Personalizado</option>
          </select>
        </div>

        {dateRange === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            />
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>hasta</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            />
          </div>
        )}
      </div>

      {/* Botones de exportación */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleExportPDF}
          disabled={!hasDataToExport}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasDataToExport
              ? isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              : isDark
                ? "bg-slate-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PDF</span>
        </button>
        <button
          onClick={handleExportExcel}
          disabled={!hasDataToExport}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasDataToExport
              ? isDark
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
              : isDark
                ? "bg-slate-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Excel</span>
        </button>
      </div>
    </div>
  );
};

