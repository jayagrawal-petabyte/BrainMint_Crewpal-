export interface CreateAuditLogInput {
  userId?: number | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  details?: Record<string, unknown> | string | null;
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  entityType?: string;
  limit?: string;
  offset?: string;
}
