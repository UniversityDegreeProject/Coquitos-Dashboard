import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Assuming sonner is used, based on other features likely using toast
import {
  getSystemConfig,
  updateSystemConfig,
} from "../services/system-config.service";
import type { UpdateSystemConfigDto } from "../interfaces/system-config";

export const useSystemConfig = () => {
  const queryClient = useQueryClient();

  // Query para obtener configs
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["system-config"],
    queryFn: getSystemConfig,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Helper local para obtener valor de una clave especifica
  const getConfigValue = (key: string): string => {
    if (!data?.configs) return "";
    const config = data.configs.find((c) => c.key === key);
    return config ? config.value : "";
  };

  // Mutation para actualizar
  const updateConfigMutation = useMutation({
    mutationFn: (data: UpdateSystemConfigDto) => updateSystemConfig(data),
    onSuccess: () => {
      toast.success("Configuración actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["system-config"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar configuración");
    },
  });

  return {
    configs: data?.configs || [],
    getConfigValue,
    isLoading,
    isError,
    error,
    updateConfig: updateConfigMutation.mutate,
    isUpdating: updateConfigMutation.isPending,
  };
};
