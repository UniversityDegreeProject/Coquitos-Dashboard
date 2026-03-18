/**
 * Re-exporta todos los tipos e interfaces desde shared/reports
 * Mantiene la consistencia y evita duplicación
 */
export type {
  DailyReport,
  SalesReport,
  ProductsReport,
  CustomersReport,
  CashRegisterSummaryReport,
  ProductReportItem,
  CustomerReportItem,
  CashRegisterSummaryDay,
  CashRegisterInfo,
  PaymentMethod,
  CashRegisterStatus,
  DailyReportResponse,
  SalesReportResponse,
  ProductsReportResponse,
  CustomersReportResponse,
  CashRegisterSummaryResponse,
  GetDailyReportParams,
  GetSalesReportParams,
  GetProductsReportParams,
  GetCustomersReportParams,
  GetCashRegisterSummaryParams,
  SellersReport,
  SellerReportItem,
  SellersReportResponse,
  GetSellersReportParams,
} from "@/shared/reports";

