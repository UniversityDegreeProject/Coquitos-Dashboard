import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
  CreateSaleResponse,
  GetSalesResponse,
  Sale,
  SaleFormData,
  SearchSalesParams,
} from "../interfaces";

/**
 * Obtiene todas las ventas con filtros
 * GET /api/sales
 */
export const getSales = async (
  searchParams: SearchSalesParams,
): Promise<GetSalesResponse> => {
  const clearParams: Record<string, unknown> = {
    page: searchParams.page,
    limit: searchParams.limit,
  };

  if (searchParams.userId?.trim() !== "") {
    clearParams.userId = searchParams.userId;
  }
  if (searchParams.customerId?.trim() !== "") {
    clearParams.customerId = searchParams.customerId;
  }
  if (searchParams.cashRegisterId?.trim() !== "") {
    clearParams.cashRegisterId = searchParams.cashRegisterId;
  }
  if (searchParams.status && searchParams.status.trim() !== "") {
    clearParams.status = searchParams.status;
  }
  if (searchParams.paymentMethod && searchParams.paymentMethod.trim() !== "") {
    clearParams.paymentMethod = searchParams.paymentMethod;
  }
  if (searchParams.startDate) {
    if (searchParams.startDate instanceof Date) {
      clearParams.startDate = searchParams.startDate.toISOString();
    } else {
      clearParams.startDate = searchParams.startDate;
    }
  }
  if (searchParams.endDate) {
    if (searchParams.endDate instanceof Date) {
      clearParams.endDate = searchParams.endDate.toISOString();
    } else {
      clearParams.endDate = searchParams.endDate;
    }
  }

  // Parámetro de búsqueda textual
  if (searchParams.search?.trim()) {
    clearParams.search = searchParams.search.trim();
  }

  try {
    const response = await CoquitoApi.get<GetSalesResponse>(`/sales`, {
      params: clearParams,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || "Error al obtener ventas");
    }
    throw new Error("Error desconocido al obtener ventas");
  }
};

/**
 * Obtiene una venta por su ID
 * GET /api/sales/:id
 */
export const getSaleById = async (saleId: string): Promise<Sale> => {
  try {
    const response = await CoquitoApi.get<{ sale: Sale }>(`/sales/${saleId}`);
    return response.data.sale;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || "Error al obtener venta");
    }
    throw new Error("Error desconocido al obtener venta");
  }
};

/**
 * Crea una nueva venta
 * POST /api/sales
 */
export const createSale = async (
  saleData: SaleFormData,
): Promise<CreateSaleResponse> => {
  try {
    const response = await CoquitoApi.post<CreateSaleResponse>(
      "/sales",
      saleData,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || "Error al crear venta");
    }
    throw new Error("Error desconocido al crear venta");
  }
};
