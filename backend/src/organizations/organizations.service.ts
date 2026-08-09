/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CreateOrganizationSettingsDto } from './dto/create-organization-settings.dto';
import { UpdateOrganizationSettingsDto } from './dto/update-organization-settings.dto';
import { Role } from '../common/constants/roles.constant';

const COLUMNS = 'id, name, is_active, created_at, updated_at';
const DEFAULT_WORKING_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

@Injectable()
export class OrganizationsService {
  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  private verifyOrgAccess(
    targetOrgId: number,
    user: { organization_id: number; role_id: Role },
  ) {
    if (user.role_id === Role.SUPER_ADMIN) return;
    if (user.organization_id !== targetOrgId) {
      throw new NotFoundException(`Organization ${targetOrgId} not found`);
    }
  }

  async create(dto: CreateOrganizationDto) {
    const existing = await this.pool.query(
      'SELECT id FROM organizations WHERE name = $1',
      [dto.name],
    );
    if (existing.rows.length > 0)
      throw new ConflictException('Organization name already exists');

    const result = await this.pool.query(
      `INSERT INTO organizations (name) VALUES ($1) RETURNING ${COLUMNS}`,
      [dto.name],
    );
    return result.rows[0];
  }

  async findAll(user: { organization_id: number; role_id: Role }) {
    if (user.role_id === Role.SUPER_ADMIN) {
      return (
        await this.pool.query(
          `SELECT ${COLUMNS} FROM organizations ORDER BY id`,
        )
      ).rows;
    }

    return (
      await this.pool.query(
        `SELECT ${COLUMNS} FROM organizations WHERE id = $1 ORDER BY id`,
        [user.organization_id],
      )
    ).rows;
  }

  async findOne(id: number, user: { organization_id: number; role_id: Role }) {
    this.verifyOrgAccess(id, user);

    const result = await this.pool.query(
      `SELECT ${COLUMNS} FROM organizations WHERE id = $1`,
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundException(`Organization ${id} not found`);
    return result.rows[0];
  }

  async update(
    id: number,
    dto: UpdateOrganizationDto,
    user: { organization_id: number; role_id: Role },
  ) {
    this.verifyOrgAccess(id, user);
    await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE organizations SET name = COALESCE($1, name), updated_at = NOW() WHERE id = $2 RETURNING ${COLUMNS}`,
      [dto.name ?? null, id],
    );
    return result.rows[0];
  }

  async deactivate(id: number) {
    const result = await this.pool.query(
      `SELECT ${COLUMNS} FROM organizations WHERE id = $1`,
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundException(`Organization ${id} not found`);

    const deactivated = await this.pool.query(
      `UPDATE organizations SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, name, is_active`,
      [id],
    );
    return deactivated.rows[0];
  }

  async getSettings(
    id: number,
    user: { organization_id: number; role_id: Role },
  ) {
    this.verifyOrgAccess(id, user);
    const organization = await this.findOne(id, user);

    const settingsRow = await this.getSettingsRow(id);
    return this.mapSettingsResponse(organization, settingsRow);
  }

  async upsertSettings(
    id: number,
    dto: UpdateOrganizationSettingsDto | CreateOrganizationSettingsDto,
    user: { organization_id: number; role_id: Role },
  ) {
    this.verifyOrgAccess(id, user);
    const organization = await this.findOne(id, user);

    const currentSettings = await this.getSettingsRow(id);
    const payload = this.buildSettingsPayload(
      dto,
      organization,
      currentSettings,
    );

    if (!currentSettings) {
      const result = await this.pool.query(
        `INSERT INTO organization_settings (
          organization_id,
          organization_name,
          timezone,
          working_days,
          default_task_priority,
          email_notifications,
          theme,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING organization_id, organization_name, timezone, working_days, default_task_priority, email_notifications, theme`,
        [
          id,
          payload.organizationName,
          payload.timezone,
          JSON.stringify(payload.workingDays),
          payload.defaultTaskPriority,
          payload.emailNotifications,
          payload.theme,
        ],
      );
      return this.mapSettingsResponse(organization, result.rows[0]);
    }

    const result = await this.pool.query(
      `UPDATE organization_settings
       SET organization_name = COALESCE($1, organization_name),
           timezone = COALESCE($2, timezone),
           working_days = COALESCE($3::jsonb, working_days),
           default_task_priority = COALESCE($4, default_task_priority),
           email_notifications = COALESCE($5::boolean, email_notifications),
           theme = COALESCE($6, theme),
           updated_at = NOW()
       WHERE organization_id = $7
       RETURNING organization_id, organization_name, timezone, working_days, default_task_priority, email_notifications, theme`,
      [
        payload.organizationName ?? null,
        payload.timezone ?? null,
        payload.workingDays ? JSON.stringify(payload.workingDays) : null,
        payload.defaultTaskPriority ?? null,
        payload.emailNotifications ?? null,
        payload.theme ?? null,
        id,
      ],
    );

    return this.mapSettingsResponse(organization, result.rows[0]);
  }

  private async getSettingsRow(organizationId: number) {
    const result = await this.pool.query(
      `SELECT organization_id, organization_name, timezone, working_days, default_task_priority, email_notifications, theme
       FROM organization_settings WHERE organization_id = $1`,
      [organizationId],
    );
    return result.rows[0];
  }

  private buildSettingsPayload(
    dto: UpdateOrganizationSettingsDto | CreateOrganizationSettingsDto,
    organization: { name: string },
    currentSettings?: Record<string, any>,
  ) {
    const fallbackName =
      currentSettings?.organization_name ?? organization.name;
    const fallbackTimezone = currentSettings?.timezone ?? 'UTC';
    const fallbackWorkingDays = this.normalizeWorkingDays(
      currentSettings?.working_days,
    );
    const fallbackPriority = currentSettings?.default_task_priority ?? 'medium';
    const fallbackEmailNotifications =
      currentSettings?.email_notifications ?? true;
    const fallbackTheme = currentSettings?.theme ?? 'light';

    return {
      organizationName: dto.organizationName ?? fallbackName,
      timezone: dto.timezone ?? fallbackTimezone,
      workingDays: dto.workingDays
        ? this.normalizeWorkingDays(dto.workingDays)
        : fallbackWorkingDays,
      defaultTaskPriority: dto.defaultTaskPriority ?? fallbackPriority,
      emailNotifications: dto.emailNotifications ?? fallbackEmailNotifications,
      theme: dto.theme ?? fallbackTheme,
    };
  }

  private normalizeWorkingDays(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    return [...DEFAULT_WORKING_DAYS];
  }

  private mapSettingsResponse(
    organization: { id: number; name: string },
    settingsRow?: Record<string, any>,
  ) {
    return {
      organizationId: organization.id,
      organizationName: settingsRow?.organization_name ?? organization.name,
      timezone: settingsRow?.timezone ?? 'UTC',
      workingDays: this.normalizeWorkingDays(settingsRow?.working_days),
      defaultTaskPriority: settingsRow?.default_task_priority ?? 'medium',
      emailNotifications: settingsRow?.email_notifications ?? true,
      theme: settingsRow?.theme ?? 'light',
    };
  }
}
