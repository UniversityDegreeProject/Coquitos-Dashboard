import { CoquitoApi } from "@/config/axios.adapter";
import { AxiosError } from "axios";
import type {
  GetSystemConfigResponse,
  UpdateSystemConfigDto,
  UpdateSystemConfigResponse,
} from "../interfaces/system-config";

/**
 * Obtiene la configuración actual del sistema
 */
export const getSystemConfig = async (): Promise<GetSystemConfigResponse> => {
  try {
    const response = await CoquitoApi.get<GetSystemConfigResponse>(
      "/system-config"
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.error || "Error al obtener configuración"
      );
    }
    throw new Error("Error desconocido");
  }
};

/**
 * Actualiza la configuración del sistema
 */
export const updateSystemConfig = async (
  data: UpdateSystemConfigDto
): Promise<UpdateSystemConfigResponse> => {
  try {
    const response = await CoquitoApi.put<UpdateSystemConfigResponse>(
      "/system-config",
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.error || "Error al actualizar configuración"
      );
    }
    throw new Error("Error desconocido");
  }
};
