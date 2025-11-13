import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
  CreateOrderResponse,
  GetOrdersResponse,
  Order,
  OrderFormData,
  SearchOrdersParams,
} from "../interfaces";

/**
 * Obtiene todas las órdenes con filtros
 * GET /api/orders
 */
export const getOrders = async (searchParams: SearchOrdersParams): Promise<GetOrdersResponse> => {
  const clearParams: Partial<SearchOrdersParams> = {
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
    // Convertir Date a string ISO si es necesario
    clearParams.startDate = searchParams.startDate instanceof Date 
      ? new Date(searchParams.startDate.toISOString().split('T')[0])
      : searchParams.startDate;
  }
  if (searchParams.endDate) {
    // Convertir Date a string ISO si es necesario
    clearParams.endDate = searchParams.endDate instanceof Date 
      ? new Date(searchParams.endDate.toISOString().split('T')[0])
      : searchParams.endDate;
  }

  try {
    const response = await CoquitoApi.get<GetOrdersResponse>(`/orders`, { params: clearParams });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener órdenes');
    }
    throw new Error('Error desconocido al obtener órdenes');
  }
};

/**
 * Obtiene una orden por su ID
 * GET /api/orders/:id
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await CoquitoApi.get<{ order: Order }>(`/orders/${orderId}`);
    return response.data.order;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener orden');
    }
    throw new Error('Error desconocido al obtener orden');
  }
};

/**
 * Crea una nueva orden (venta)
 * POST /api/orders
 */
export const createOrder = async (orderData: OrderFormData): Promise<CreateOrderResponse> => {
  try {
    const response = await CoquitoApi.post<CreateOrderResponse>('/orders', orderData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al crear orden');
    }
    throw new Error('Error desconocido al crear orden');
  }
};

