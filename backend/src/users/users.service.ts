// users/users.service.ts
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/constants/roles.constant';

const SAFE_COLUMNS =
  'id, organization_id, role_id, name, email, is_active, created_at, updated_at';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  private verifyOrgAccess(
    targetOrgId: number,
    user: { organization_id: number; role_id: number },
  ) {
    if (user.role_id === Role.SUPER_ADMIN) return;
    if (user.organization_id !== targetOrgId) {
      throw new NotFoundException('User not found');
    }
  }

  async create(
    dto: CreateUserDto,
    user: { organization_id: number; role_id: number },
  ) {
    if (user.role_id !== Role.SUPER_ADMIN) {
      if (dto.organizationId !== user.organization_id) {
        throw new ForbiddenException(
          'Cannot create users in another organization',
        );
      }
      if (dto.roleId === Role.SUPER_ADMIN) {
        throw new ForbiddenException('Cannot assign SUPER_ADMIN role');
      }
    }

    const existing = await this.pool.query(
      'SELECT id FROM users WHERE email = $1',
      [dto.email],
    );
    if (existing.rows.length > 0)
      throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const result = await this.pool.query(
      `INSERT INTO users (organization_id, role_id, name, email, password_hash)
       VALUES ($1, $2, $3, $4, $5) RETURNING ${SAFE_COLUMNS}`,
      [dto.organizationId, dto.roleId, dto.name, dto.email, passwordHash],
    );
    return result.rows[0];
  }

  async findAll(user: { organization_id: number; role_id: number }) {
    if (user.role_id === Role.SUPER_ADMIN) {
      const result = await this.pool.query(
        `SELECT ${SAFE_COLUMNS} FROM users ORDER BY id`,
      );
      return result.rows;
    }

    const result = await this.pool.query(
      `SELECT ${SAFE_COLUMNS} FROM users WHERE organization_id = $1 ORDER BY id`,
      [user.organization_id],
    );
    return result.rows;
  }

  async findOne(
    id: number,
    user: { organization_id: number; role_id: number },
  ) {
    const result = await this.pool.query(
      `SELECT ${SAFE_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundException('User not found');

    this.verifyOrgAccess(result.rows[0].organization_id, user);
    return result.rows[0];
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    user: { organization_id: number; role_id: number },
  ) {
    const target = await this.findOne(id, user);

    if (dto.organizationId !== undefined && user.role_id !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot change user organization');
    }

    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${i++}`);
      values.push(dto.name);
    }
    if (dto.email !== undefined) {
      fields.push(`email = $${i++}`);
      values.push(dto.email);
    }
    if (dto.organizationId !== undefined) {
      fields.push(`organization_id = $${i++}`);
      values.push(dto.organizationId);
    }
    if (fields.length === 0) return target;

    fields.push('updated_at = NOW()');
    values.push(id);

    const result = await this.pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${SAFE_COLUMNS}`,
      values,
    );
    return result.rows[0];
  }

  async deactivate(
    id: number,
    user: { organization_id: number; role_id: number },
  ) {
    await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, is_active`,
      [id],
    );
    return result.rows[0];
  }

  async updateRole(
    id: number,
    roleId: number,
    user: { organization_id: number; role_id: number },
  ) {
    if (user.role_id !== Role.SUPER_ADMIN && roleId === Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can assign SUPER_ADMIN role');
    }

    const role = await this.pool.query('SELECT id FROM roles WHERE id = $1', [
      roleId,
    ]);
    if (role.rows.length === 0)
      throw new NotFoundException(`Role ${roleId} not found`);

    await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE users SET role_id = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, role_id`,
      [roleId, id],
    );
    return result.rows[0];
  }
}
