import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type { AuditLogItem, AuditStats, AuditListParams } from "../types/audit";

export const auditApi = {
  getList: (params?: AuditListParams) =>
    api.get<SuccessResponsePaginated<AuditLogItem>>(
      "/audit-logs",
      params as Record<string, string | number | undefined>,
    ),

  getById: (id: string) =>
    api.get<SuccessResponse<AuditLogItem>>(`/audit-logs/${id}`),

  getStats: () =>
    api.get<SuccessResponse<AuditStats>>("/audit-logs/stats"),
};
