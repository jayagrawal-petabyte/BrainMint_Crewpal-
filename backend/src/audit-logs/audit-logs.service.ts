import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import {
  AuditLogFilters,
  CreateAuditLogInput,
} from './interfaces/audit-log.interface';

const AUDIT_COLUMNS =
  'id, user_id, action, entity_type, entity_id, details, created_at';

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  async create(input: CreateAuditLogInput) {
    const details =
      typeof input.details === 'string'
        ? input.details
        : JSON.stringify(input.details ?? {});

    const result = await this.pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${AUDIT_COLUMNS}`,
      [
        input.userId ?? null,
        input.action,
        input.entityType,
        input.entityId ?? null,
        details,
      ],
    );

    return result.rows[0];
  }

  async findAll(filters: AuditLogFilters = {}) {
    const clauses: string[] = [];
    const values: Array<number | string> = [];

    if (filters.userId) {
      values.push(Number(filters.userId));
      clauses.push(`user_id = $${values.length}`);
    }

    if (filters.action) {
      values.push(filters.action);
      clauses.push(`action = $${values.length}`);
    }

    if (filters.entityType) {
      values.push(filters.entityType);
      clauses.push(`entity_type = $${values.length}`);
    }

    const limit = Math.min(Number(filters.limit) || 50, 100);
    const offset = Number(filters.offset) || 0;
    values.push(limit, offset);

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await this.pool.query(
      `SELECT ${AUDIT_COLUMNS}
       FROM audit_logs
       ${where}
       ORDER BY created_at DESC
       LIMIT $${values.length - 1}
       OFFSET $${values.length}`,
      values,
    );

    return result.rows;
  }

  async recordSafely(input: CreateAuditLogInput) {
    try {
      await this.create(input);
    } catch (error) {
      this.logger.warn(
        `Failed to write audit log for ${input.action}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }
}
