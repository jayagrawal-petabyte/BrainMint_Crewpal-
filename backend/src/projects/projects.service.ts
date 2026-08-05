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

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('PG_CONNECTION')
    private readonly pool: Pool,
  ) {}

  private verifyOrgAccess(
    projectOrgId: number,
    user: { organization_id: number; role_id: number },
  ) {
    if (user.role_id === Role.SUPER_ADMIN) return;
    if (user.organization_id !== projectOrgId) {
      throw new NotFoundException('Project not found');
    }
  }

  async create(
    dto: CreateProjectDto,
    user: { id: number; organization_id: number; role_id: number },
  ) {
    if (
      user.role_id !== Role.SUPER_ADMIN &&
      user.organization_id !== dto.organizationId
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
      throw new ConflictException('Project with this name already exists');
    }

    const result = await this.pool.query(
      `INSERT INTO projects (
          organization_id,
          name,
          description,
          created_by
      )
      VALUES ($1,$2,$3,$4)
      RETURNING ${COLUMNS}`,
      [dto.organizationId, dto.name, dto.description ?? null, user.id],
    );

    return result.rows[0];
  }

  async findAll(user: { organization_id: number; role_id: number }) {
    if (user.role_id === Role.SUPER_ADMIN) {
      const result = await this.pool.query(
        `SELECT ${COLUMNS}
         FROM projects
         WHERE is_active = TRUE
         ORDER BY id`,
      );
      return result.rows;
    }

    const result = await this.pool.query(
      `SELECT ${COLUMNS}
       FROM projects
       WHERE is_active = TRUE AND organization_id = $1
       ORDER BY id`,
      [user.organization_id],
    );
    return result.rows;
  }

  async searchProjects(filters: {
    search?: string;
    organizationId?: number;
    isActive?: boolean;
  }) {
    let query = `SELECT ${COLUMNS} FROM projects WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

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

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findOne(
    id: number,
    user?: { organization_id: number; role_id: number },
  ) {
    const result = await this.pool.query(
      `SELECT ${COLUMNS}
       FROM projects
       WHERE id = $1
       AND is_active = TRUE`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Project not found');
    }

    if (user) {
      this.verifyOrgAccess(result.rows[0].organization_id, user);
    }

    return result.rows[0];
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
    user: { organization_id: number; role_id: number },
  ) {
    const project = await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE projects
       SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          updated_at = NOW()
       WHERE id = $3
       RETURNING ${COLUMNS}`,
      [dto.name ?? null, dto.description ?? null, id],
    );

    return result.rows[0];
  }

  async deactivate(
    id: number,
    user?: { organization_id: number; role_id: number },
  ) {
    if (user) {
      await this.findOne(id, user);
    } else {
      const result = await this.pool.query(
        `SELECT ${COLUMNS} FROM projects WHERE id = $1 AND is_active = TRUE`,
        [id],
      );
      if (result.rows.length === 0) {
        throw new NotFoundException('Project not found');
      }
    }

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
