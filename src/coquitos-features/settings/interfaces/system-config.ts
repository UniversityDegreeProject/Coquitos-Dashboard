export interface SystemConfig {
  id: string; // Assuming standard Prisma ID
  key: string;
  value: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemConfigItem {
  key: string;
  value: string;
  description?: string;
}

export interface UpdateSystemConfigDto {
  configs: SystemConfigItem[];
}

export interface GetSystemConfigResponse {
  configs: SystemConfig[];
}

export interface UpdateSystemConfigResponse {
  message: string;
  configs: SystemConfig[];
}
