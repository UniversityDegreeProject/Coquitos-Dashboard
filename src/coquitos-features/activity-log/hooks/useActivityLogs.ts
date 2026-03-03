import { useQuery } from "@tanstack/react-query";
import {
  getActivityLogs,
  getActivityLogById,
} from "../services/activity-log.service";
import type { SearchActivityLogsParams } from "../interfaces/activity-log";
import { useSocketEvent } from "@/lib/socket";

const ACTIVITY_LOGS_KEY = ["activity-logs"] as const;

export const useActivityLogs = (params: SearchActivityLogsParams = {}) => {
  const query = useQuery({
    queryKey: [...ACTIVITY_LOGS_KEY, params],
    queryFn: () => getActivityLogs(params),
    staleTime: 1000 * 30, // 30 seconds
  });

  // Socket real-time: actividades se generan con cada mutación del sistema
  useSocketEvent("sale:created", ACTIVITY_LOGS_KEY);
  useSocketEvent("cash-register:opened", ACTIVITY_LOGS_KEY);
  useSocketEvent("cash-register:closed", ACTIVITY_LOGS_KEY);
  useSocketEvent("user:created", ACTIVITY_LOGS_KEY);
  useSocketEvent("user:updated", ACTIVITY_LOGS_KEY);
  useSocketEvent("user:deleted", ACTIVITY_LOGS_KEY);
  useSocketEvent("product:created", ACTIVITY_LOGS_KEY);
  useSocketEvent("product:updated", ACTIVITY_LOGS_KEY);
  useSocketEvent("product:deleted", ACTIVITY_LOGS_KEY);
  useSocketEvent("category:created", ACTIVITY_LOGS_KEY);
  useSocketEvent("category:updated", ACTIVITY_LOGS_KEY);
  useSocketEvent("category:deleted", ACTIVITY_LOGS_KEY);

  return query;
};

export const useActivityLogById = (id: string) => {
  return useQuery({
    queryKey: ["activity-log", id],
    queryFn: () => getActivityLogById(id),
    enabled: !!id,
  });
};
