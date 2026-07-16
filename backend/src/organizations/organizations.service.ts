// organizations/organizations.service.ts
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

const COLUMNS = 'id, name, is_active, created_at, updated_at';

@Injectable()
export class OrganizationsService {
  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  async create(dto: CreateOrganizationDto) {
    const existing = await this.pool.query('SELECT id FROM organizations WHERE name = $1', [dto.name]);
    if (existing.rows.length > 0) throw new ConflictException('Organization name already exists');

    const result = await this.pool.query(
      `INSERT INTO organizations (name) VALUES ($1) RETURNING ${COLUMNS}`,
      [dto.name],
    );
    return result.rows[0];
  }

  async findAll() {
    return (await this.pool.query(`SELECT ${COLUMNS} FROM organizations ORDER BY id`)).rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(`SELECT ${COLUMNS} FROM organizations WHERE id = $1`, [id]);
    if (result.rows.length === 0) throw new NotFoundException(`Organization ${id} not found`);
    return result.rows[0];
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    await this.findOne(id);
    const result = await this.pool.query(
      `UPDATE organizations SET name = COALESCE($1, name), updated_at = NOW() WHERE id = $2 RETURNING ${COLUMNS}`,
      [dto.name ?? null, id],
    );
    return result.rows[0];
  }

  async deactivate(id: number) {
    await this.findOne(id);
    const result = await this.pool.query(
      `UPDATE organizations SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, name, is_active`,
      [id],
    );
    return result.rows[0];
  }
}