import { OrganizationsService } from './organizations.service';

describe('OrganizationsService settings', () => {
  let service: OrganizationsService;
  let pool: { query: jest.Mock };

  beforeEach(() => {
    pool = {
      query: jest.fn(),
    };
    service = new OrganizationsService(pool as any);
  });

  it('returns default settings when no organization settings row exists', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Acme', is_active: true }],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await service.getSettings(1);

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

    const result = await service.upsertSettings(1, {
      timezone: 'America/New_York',
      workingDays: ['Monday', 'Wednesday'],
      defaultTaskPriority: 'high',
      emailNotifications: false,
      theme: 'dark',
    });

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
});
