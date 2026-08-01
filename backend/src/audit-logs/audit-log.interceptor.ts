import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditLogsService } from './audit-logs.service';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const SENSITIVE_FIELDS = new Set(['password', 'password_hash', 'access_token']);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    if (
      !MUTATING_METHODS.has(request.method) ||
      request.path.startsWith('/auth')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((response) => {
        const userId = request.user?.id ?? response?.user?.id ?? null;
        const entity = this.resolveEntity(request.path);

        void this.auditLogsService.recordSafely({
          userId,
          action: `${request.method} ${request.path}`,
          entityType: entity.type,
          entityId: entity.id,
          details: {
            params: request.params,
            query: request.query,
            body: this.sanitize(request.body),
          },
        });
      }),
    );
  }

  private resolveEntity(path: string) {
    const [, entityType, entityId] = path.split('/');

    return {
      type: entityType || 'unknown',
      id: entityId && !Number.isNaN(Number(entityId)) ? Number(entityId) : null,
    };
  }

  private sanitize(value: unknown): unknown {
    if (!value || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        SENSITIVE_FIELDS.has(key.toLowerCase())
          ? '[REDACTED]'
          : this.sanitize(item),
      ]),
    );
  }
}
