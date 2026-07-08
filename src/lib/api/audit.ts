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

  exportData: async (params: Record<string, string | number | undefined>) => {
    const { blob, filename } = await api.download("/audit-logs/export", params);
    triggerDownload(blob, filename);
  },
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
