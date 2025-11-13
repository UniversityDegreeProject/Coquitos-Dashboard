import type {
  GetDailyReportParams,
  GetSalesReportParams,
  GetProductsReportParams,
  GetCustomersReportParams,
  GetCashRegisterSummaryParams,
} from "@/shared/reports";

/**
 * Definición de query keys para TanStack Query
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const reportsQueries = {
  allReports: ["reports"] as const,
  dailyReport: (params: GetDailyReportParams) => [...reportsQueries.allReports, "daily", params] as const,
  salesReport: (params: GetSalesReportParams) => [...reportsQueries.allReports, "sales", params] as const,
  productsReport: (params: GetProductsReportParams) => [...reportsQueries.allReports, "products", params] as const,
  customersReport: (params: GetCustomersReportParams) => [...reportsQueries.allReports, "customers", params] as const,
  cashRegisterSummary: (params: GetCashRegisterSummaryParams) =>
    [...reportsQueries.allReports, "cash-register-summary", params] as const,
};

