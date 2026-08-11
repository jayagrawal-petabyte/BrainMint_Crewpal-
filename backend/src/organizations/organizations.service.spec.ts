import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService settings', () => {
  let service: OrganizationsService;
  let pool: { query: jest.Mock };
  let auditLogsService: { recordSafely: jest.Mock };

  beforeEach(() => {
    pool = {
      query: jest.fn(),
    };
    auditLogsService = {
      recordSafely: jest.fn().mockResolvedValue(undefined),
    };
    service = new OrganizationsService(pool as any, auditLogsService as any);
  });

  it('returns default settings when no organization settings row exists', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Acme', is_active: true }],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await service.getSettings(1, {
      organization_id: 1,
      role_id: 2,
    });

    expect(result).toEqual({
      organizationId: 1,
      organizationName: 'Acme',
      timezone: 'UTC',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      defaultTaskPriority: 'medium',
      emailNotifications: true,
      theme: 'light',
    });
  });

  it('creates settings on first update when none exist', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Acme', is_active: true }],
      })
      .mockResolvedValueOnce({ rows: [] })

      .mockResolvedValueOnce({
        rows: [
          {
            organization_id: 1,
            organization_name: 'Acme',
            timezone: 'America/New_York',
            working_days: ['Monday', 'Wednesday'],
            default_task_priority: 'high',
            email_notifications: false,
            theme: 'dark',
          },
        ],
      });

    const result = await service.upsertSettings(
      1,
      {
        timezone: 'America/New_York',
        workingDays: ['Monday', 'Wednesday'],
        defaultTaskPriority: 'high',
        emailNotifications: false,
        theme: 'dark',
      },
      { organization_id: 1, role_id: 2 },
    );

    expect(result).toEqual({
      organizationId: 1,
      organizationName: 'Acme',
      timezone: 'America/New_York',
      workingDays: ['Monday', 'Wednesday'],
      defaultTaskPriority: 'high',
      emailNotifications: false,
      theme: 'dark',
    });
  });

  it('updates a user role within the same organization and logs the change', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 5 }] })
      .mockResolvedValueOnce({ rows: [{ id: 123, organization_id: 5, role_id: 4 }] })
      .mockResolvedValueOnce({ rows: [{ id: 123, organization_id: 5, role_id: 3 }] });

    const result = await service.updateUserRole(
      5,
      123,
      { role: 'PROJECT_ADMIN' },
      { id: 1, organization_id: 5, role_id: 2 },
    );

    expect(result).toEqual({
      message: 'Role updated successfully',
      userId: 123,
      organizationId: 5,
      role: 'PROJECT_ADMIN',
    });
    expect(auditLogsService.recordSafely).toHaveBeenCalledWith({
      userId: 1,
      action: 'UPDATE_ROLE',
      entityType: 'user',
      entityId: 123,
      details: {
        organizationId: 5,
        previousRoleId: 4,
        roleId: 3,
        role: 'PROJECT_ADMIN',
      },
    });
  });
});
