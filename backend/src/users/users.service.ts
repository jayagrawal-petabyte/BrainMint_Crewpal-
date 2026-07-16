// users/users.service.ts
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt'; // swap for whatever auth.service.ts already uses, if different
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SAFE_COLUMNS = 'id, organization_id, role_id, name, email, is_active, created_at, updated_at';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  async create(dto: CreateUserDto) {
    const existing = await this.pool.query('SELECT id FROM users WHERE email = $1', [dto.email]);
    if (existing.rows.length > 0) throw new ConflictException('Email already in use');

    // If auth.service.ts already exports a hashing helper, use that instead of hashing again here.
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const result = await this.pool.query(
      `INSERT INTO users (organization_id, role_id, name, email, password_hash)
       VALUES ($1, $2, $3, $4, $5) RETURNING ${SAFE_COLUMNS}`,
      [dto.organizationId, dto.roleId, dto.name, dto.email, passwordHash],
    );
    return result.rows[0];
  }

  async findAll(organizationId?: number) {
    const result = organizationId
      ? await this.pool.query(`SELECT ${SAFE_COLUMNS} FROM users WHERE organization_id = $1 ORDER BY id`, [organizationId])
      : await this.pool.query(`SELECT ${SAFE_COLUMNS} FROM users ORDER BY id`);
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(`SELECT ${SAFE_COLUMNS} FROM users WHERE id = $1`, [id]);
    if (result.rows.length === 0) throw new NotFoundException(`User ${id} not found`);
    return result.rows[0];
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (dto.name !== undefined) { fields.push(`name = $${i++}`); values.push(dto.name); }
    if (dto.email !== undefined) { fields.push(`email = $${i++}`); values.push(dto.email); }
    if (dto.organizationId !== undefined) { fields.push(`organization_id = $${i++}`); values.push(dto.organizationId); }
    if (fields.length === 0) return this.findOne(id);

    fields.push('updated_at = NOW()');
    values.push(id);

    const result = await this.pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${SAFE_COLUMNS}`,
      values,
    );
    return result.rows[0];
  }

  async deactivate(id: number) {
    await this.findOne(id);
    const result = await this.pool.query(
      `UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, is_active`,
      [id],
    );
    return result.rows[0];
  }

  async updateRole(id: number, roleId: number) {
    const role = await this.pool.query('SELECT id FROM roles WHERE id = $1', [roleId]);
    if (role.rows.length === 0) throw new NotFoundException(`Role ${roleId} not found`);
    await this.findOne(id);

    const result = await this.pool.query(
      `UPDATE users SET role_id = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, role_id`,
      [roleId, id],
    );
    return result.rows[0];
  }
}