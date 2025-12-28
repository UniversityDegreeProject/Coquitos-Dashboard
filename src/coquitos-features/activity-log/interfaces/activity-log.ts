export interface ActivityLog {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  entity: string;
  entityId: string | null;
  description: string;
  metadata: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface SearchActivityLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface GetActivityLogsResponse {
  activityLogs: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ParsedMetadata {
  [key: string]: unknown;
}
