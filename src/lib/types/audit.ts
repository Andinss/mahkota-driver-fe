export interface AuditLogItem {
  id: string;
  user_id?: string;
  username: string;
  action: string;
  target?: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  status: string;
  created_at: string;
}

export interface AuditStats {
  totalEvents: number;
  securityAlerts: number;
  userActions: number;
  failedRequests: number;
}

export interface AuditListParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  status?: string;
}
