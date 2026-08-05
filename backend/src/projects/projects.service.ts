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

  async create(
    dto: CreateProjectDto,
    user: { id: number; organization_id: number },
  ) {
    if (user.organization_id !== dto.organizationId) {
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

  async findAll() {
    const result = await this.pool.query(
      `SELECT ${COLUMNS}
       FROM projects
       WHERE is_active = TRUE
       ORDER BY id`,
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      `SELECT ${COLUMNS}
       FROM projects
       WHERE id = $1
       AND is_active = TRUE`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    return result.rows[0];
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id);

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

  async deactivate(id: number) {
    await this.findOne(id);

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
