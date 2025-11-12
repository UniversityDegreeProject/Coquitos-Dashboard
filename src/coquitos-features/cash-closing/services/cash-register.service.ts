import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
  OpenCashRegisterFormData,
  CloseCashRegisterFormData,
  OpenCashRegisterResponse,
  CloseCashRegisterResponse,
  GetCurrentCashRegisterResponse,
  GetCashRegisterHistoryParams,
  GetCashRegisterHistoryResponse,
} from "../interfaces";

/**
 * Abre una nueva caja
 * POST /api/cash-register/open
 */
export const openCashRegister = async (data: OpenCashRegisterFormData): Promise<OpenCashRegisterResponse> => {
  try {
    const response = await CoquitoApi.post<OpenCashRegisterResponse>('/cash-register/open', data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al abrir caja');
    }
    throw new Error('Error desconocido al abrir caja');
  }
};

/**
 * Cierra la caja actual
 * POST /api/cash-register/close
 */
export const closeCashRegister = async (data: CloseCashRegisterFormData): Promise<CloseCashRegisterResponse> => {
  try {
    const response = await CoquitoApi.post<CloseCashRegisterResponse>('/cash-register/close', data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al cerrar caja');
    }
    throw new Error('Error desconocido al cerrar caja');
  }
};

/**
 * Obtiene la caja actualmente abierta del usuario
 * GET /api/cash-register/current/:userId
 */
export const getCurrentCashRegister = async (userId: string): Promise<GetCurrentCashRegisterResponse> => {
  try {
    const response = await CoquitoApi.get<GetCurrentCashRegisterResponse>(`/cash-register/current/${userId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener caja actual');
    }
    throw new Error('Error desconocido al obtener caja actual');
  }
};

/**
 * Obtiene el historial de cierres de caja
 * GET /api/cash-register/history
 */
export const getCashRegisterHistory = async (params: GetCashRegisterHistoryParams): Promise<GetCashRegisterHistoryResponse> => {
  const clearParams: Partial<GetCashRegisterHistoryParams> = {
    page: params.page,
    limit: params.limit,
  };

  if (params.userId?.trim() !== "") {
    clearParams.userId = params.userId;
  }
  if (params.startDate) {
    clearParams.startDate = params.startDate;
  }
  if (params.endDate) {
    clearParams.endDate = params.endDate;
  }

  try {
    const response = await CoquitoApi.get<GetCashRegisterHistoryResponse>('/cash-register/history', { params: clearParams });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener historial de cierres');
    }
    throw new Error('Error desconocido al obtener historial de cierres');
  }
};

