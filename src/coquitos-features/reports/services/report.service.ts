import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
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
} from "@/shared/reports";

/**
 * Obtiene el reporte diario para una fecha específica
 * GET /api/reports/daily
 */
export const getDailyReport = async (params: GetDailyReportParams): Promise<DailyReportResponse> => {
  try {
    const response = await CoquitoApi.get<DailyReportResponse>("/reports/daily", {
      params: {
        date: params.date,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || "Error al obtener reporte diario");
    }
    throw new Error("Error desconocido al obtener reporte diario");
  }
};

/**
 * Obtiene el reporte de ventas en un rango de fechas
 * GET /api/reports/sales
 */
export const getSalesReport = async (params: GetSalesReportParams): Promise<SalesReportResponse> => {
  try {
    const response = await CoquitoApi.get<SalesReportResponse>("/reports/sales", {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || "Error al obtener reporte de ventas");
    }
    throw new Error("Error desconocido al obtener reporte de ventas");
  }
};

/**
 * Obtiene el reporte de productos más vendidos
 * GET /api/reports/products
 */
export const getProductsReport = async (params: GetProductsReportParams): Promise<ProductsReportResponse> => {
  try {
    const response = await CoquitoApi.get<ProductsReportResponse>("/reports/products", {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
        limit: params.limit,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || "Error al obtener reporte de productos");
    }
    throw new Error("Error desconocido al obtener reporte de productos");
  }
};

/**
 * Obtiene el reporte de mejores clientes
 * GET /api/reports/customers
 */
export const getCustomersReport = async (params: GetCustomersReportParams): Promise<CustomersReportResponse> => {
  try {
    const response = await CoquitoApi.get<CustomersReportResponse>("/reports/customers", {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
        limit: params.limit,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || "Error al obtener reporte de clientes");
    }
    throw new Error("Error desconocido al obtener reporte de clientes");
  }
};

/**
 * Obtiene el resumen de cierres de caja
 * GET /api/reports/cash-register-summary
 */
export const getCashRegisterSummary = async (
  params: GetCashRegisterSummaryParams
): Promise<CashRegisterSummaryResponse> => {
  try {
    const response = await CoquitoApi.get<CashRegisterSummaryResponse>("/reports/cash-register-summary", {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || "Error al obtener resumen de cierres");
    }
    throw new Error("Error desconocido al obtener resumen de cierres");
  }
};

