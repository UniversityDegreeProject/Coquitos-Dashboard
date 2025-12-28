import { CoquitoApi } from "@/config/axios.adapter";
import type {
  GetActivityLogsResponse,
  SearchActivityLogsParams,
  ActivityLog,
} from "../interfaces/activity-log";

export const getActivityLogs = async (
  params: SearchActivityLogsParams = {}
): Promise<GetActivityLogsResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.userId) queryParams.append("userId", params.userId);
  if (params.action) queryParams.append("action", params.action);
  if (params.entity) queryParams.append("entity", params.entity);
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);
  if (params.search) queryParams.append("search", params.search);

  const { data } = await CoquitoApi.get<GetActivityLogsResponse>(
    `/activity-logs?${queryParams.toString()}`
  );

  return data;
};

export const getActivityLogById = async (id: string): Promise<ActivityLog> => {
  const { data } = await CoquitoApi.get<ActivityLog>(`/activity-logs/${id}`);
  return data;
};
