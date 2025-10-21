import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
  StockMovementResponse,
  GetStockMovementsResponse,
  SearchStockMovementsResponse,
  StockMovementMutationResponse,
  StockMovementFormData,
  SearchStockMovementsParams
} from "../interfaces";

/**
 * Obtiene todos los movimientos de stock
 */
export const getStockMovements = async (): Promise<StockMovementResponse[]> => {
  try {
    const response = await CoquitoApi.get<GetStockMovementsResponse>('/stock-movements/');
    return response.data.stockMovements;
  } catch (error) {
    throw new Error(`Error al obtener movimientos de stock: ${error}`);
  }
};

/**
 * Obtiene un movimiento de stock por su ID
 */
export const getStockMovementById = async (stockMovementId: string): Promise<StockMovementResponse> => {
  try {
    const response = await CoquitoApi.get<StockMovementMutationResponse>(`/stock-movements/${stockMovementId}`);
    return response.data.stockMovement;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener movimiento de stock');
    }
    throw new Error('Error desconocido');
  }
};

/**
 * Busca movimientos de stock por término de búsqueda
 */
export const searchStockMovements = async (params: SearchStockMovementsParams): Promise<StockMovementResponse[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    
    const response = await CoquitoApi.get<SearchStockMovementsResponse>(
      `/stock-movements/search?${queryParams.toString()}`
    );
    return response.data.stockMovements;
  } catch (error) {
    throw new Error(`Error al buscar movimientos de stock: ${error}`);
  }
};

/**
 * Crea un nuevo movimiento de stock
 */
export const createStockMovement = async (stockMovementData: StockMovementFormData): Promise<StockMovementResponse> => {
  try {
    const response = await CoquitoApi.post<StockMovementMutationResponse>('/stock-movements/', stockMovementData);
    return response.data.stockMovement;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al crear movimiento de stock');
    }
    throw new Error('Error desconocido');
  }
};

