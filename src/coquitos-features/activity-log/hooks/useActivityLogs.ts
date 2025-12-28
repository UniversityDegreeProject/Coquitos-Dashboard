import { useQuery } from "@tanstack/react-query";
import {
  getActivityLogs,
  getActivityLogById,
} from "../services/activity-log.service";
import type { SearchActivityLogsParams } from "../interfaces/activity-log";

export const useActivityLogs = (params: SearchActivityLogsParams = {}) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useActivityLogById = (id: string) => {
  return useQuery({
    queryKey: ["activity-log", id],
    queryFn: () => getActivityLogById(id),
    enabled: !!id,
  });
};
