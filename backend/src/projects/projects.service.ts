import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Role } from '../common/constants/roles.constant';

const COLUMNS = `
  id,
  organization_id,
  name,
  description,
  created_by,
  is_active,
  created_at,
  updated_at
`;

interface AuthUser {
  id: number;
  organization_id: number;
  role_id: Role;
}

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('PG_CONNECTION')
    private readonly pool: Pool,
  ) {}

  private async verifyProjectAccess(
    projectId: number,
    projectOrgId: number,
    user: AuthUser,
  ) {
    // Super Admin can access every project
    if (user.role_id === Role.SUPER_ADMIN) {
      return;
    }

    // User must belong to the same organization
    if (user.organization_id !== projectOrgId) {
      throw new NotFoundException('Project not found');
    }

    // Organization Admin can access all projects
    // inside their organization
    if (user.role_id === Role.ORG_ADMIN) {
      return;
    }

    // All project-level roles must be project members
    const member = await this.pool.query(
      `SELECT id
       FROM project_members
       WHERE project_id = $1
       AND user_id = $2`,
      [projectId, user.id],
    );

    if (member.rows.length === 0) {
      throw new ForbiddenException(
        'You are not a member of this project',
      );
    }
  }

  async create(
    dto: CreateProjectDto,
    user: AuthUser,
  ) {
    // Only Super Admin can create a project
    // for another organization.
    const userRole = Number(user?.role_id);
    const userOrg = Number(user?.organization_id);

    if (
      userRole !== Role.SUPER_ADMIN &&
      userOrg !== Number(dto.organizationId)
    ) {
      throw new ForbiddenException(
        'You cannot create a project for another organization',
      );
    }

    const organization = await this.pool.query(
      `SELECT id
       FROM organizations
       WHERE id = $1
       AND is_active = TRUE`,
      [dto.organizationId],
    );

    if (organization.rows.length === 0) {
      throw new NotFoundException(
        `Organization ${dto.organizationId} not found`,
      );
    }

    const existing = await this.pool.query(
      `SELECT id
       FROM projects
       WHERE organization_id = $1
       AND LOWER(name) = LOWER($2)
       AND is_active = TRUE`,
      [dto.organizationId, dto.name],
    );

    if (existing.rows.length > 0) {
      throw new ConflictException(
        'Project with this name already exists',
      );
    }

    const result = await this.pool.query(
      `INSERT INTO projects (
        organization_id,
        name,
        description,
        created_by
      )
      VALUES ($1, $2, $3, $4)
      RETURNING ${COLUMNS}`,
      [
        dto.organizationId,
        dto.name,
        dto.description ?? null,
        user.id,
      ],
    );

    return result.rows[0];
  }

  async findAll(user: AuthUser) {
    // Super Admin can see everything
    if (user.role_id === Role.SUPER_ADMIN) {
      const result = await this.pool.query(
        `SELECT ${COLUMNS}
         FROM projects
         WHERE is_active = TRUE
         ORDER BY id`,
      );

      return result.rows;
    }

    // Organization Admin can see all projects
    // in their organization
    if (user.role_id === Role.ORG_ADMIN) {
      const result = await this.pool.query(
        `SELECT ${COLUMNS}
         FROM projects
         WHERE is_active = TRUE
         AND organization_id = $1
         ORDER BY id`,
        [user.organization_id],
      );

      return result.rows;
    }

    // Project-level roles can only see projects
    // where they are members
    const result = await this.pool.query(
      `SELECT ${COLUMNS}
       FROM projects p
       INNER JOIN project_members pm
         ON pm.project_id = p.id
       WHERE p.is_active = TRUE
       AND p.organization_id = $1
       AND pm.user_id = $2
       ORDER BY p.id`,
      [user.organization_id, user.id],
    );

    return result.rows;
  }

  async searchProjects(
    filters: {
      search?: string;
      organizationId?: number;
      isActive?: boolean;
    },
    user?: AuthUser,
  ) {
    let query = `
      SELECT ${COLUMNS}
      FROM projects
      WHERE 1 = 1
    `;

    const params: unknown[] = [];
    let paramIndex = 1;

    // Organization restriction
    if (user && user.role_id !== Role.SUPER_ADMIN) {
      query += ` AND organization_id = $${paramIndex++}`;
      params.push(user.organization_id);
    }

    if (filters.organizationId !== undefined) {
      query += ` AND organization_id = $${paramIndex++}`;
      params.push(filters.organizationId);
    }

    if (filters.isActive !== undefined) {
      query += ` AND is_active = $${paramIndex++}`;
      params.push(filters.isActive);
    }

    if (filters.search) {
      query += ` AND name ILIKE $${paramIndex++}`;
      params.push(`%${filters.search}%`);
    }

    query += ` ORDER BY id`;

    const result = await this.pool.query(
      query,
      params,
    );

    return result.rows;
  }

  async findOne(
    id: number,
    user: AuthUser,
  ) {
    const result = await this.pool.query(
      `SELECT ${COLUMNS}
       FROM projects
       WHERE id = $1
       AND is_active = TRUE`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    await this.verifyProjectAccess(
      id,
      result.rows[0].organization_id,
      user,
    );

    return result.rows[0];
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
    user: AuthUser,
  ) {
    await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE projects
       SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         updated_at = NOW()
       WHERE id = $3
       RETURNING ${COLUMNS}`,
      [
        dto.name ?? null,
        dto.description ?? null,
        id,
      ],
    );

    return result.rows[0];
  }

  async deactivate(
    id: number,
    user: AuthUser,
  ) {
    await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE projects
       SET
         is_active = FALSE,
         updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, is_active`,
      [id],
    );

    return result.rows[0];
  }
}