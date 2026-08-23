import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger(UsersService.name);
  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  private verifyOrgAccess(
    targetOrgId: number,
    user: { organization_id: number; role_id: Role },
  ) {
    if (user.role_id === Role.SUPER_ADMIN) return;
    if (user.organization_id !== targetOrgId) {
      throw new NotFoundException('User not found');
    }
  }

  async create(
    dto: CreateUserDto,
    user: { organization_id: number; role_id: Role },
  ) {
    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;

    if (
      allowedDomain &&
      !dto.email.toLowerCase().endsWith(`@${allowedDomain.toLowerCase()}`)
    ) {
      throw new ForbiddenException(
        `Only ${allowedDomain} email addresses are allowed`,
      );
    }

    const userRole = Number(user?.role_id);
    const userOrg = Number(user?.organization_id);

    if (userRole !== Role.SUPER_ADMIN) {
      if (Number(dto.organizationId) !== userOrg) {
        throw new ForbiddenException(
          'Cannot create users in another organization',
        );
      }
      if (Number(dto.roleId) === Role.SUPER_ADMIN) {
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

    try {
      const result = await this.pool.query(
        `INSERT INTO users (organization_id, role_id, name, email, password_hash)
         VALUES ($1, $2, $3, $4, $5) RETURNING ${SAFE_COLUMNS}`,
        [dto.organizationId, dto.roleId, dto.name, dto.email, passwordHash],
      );
      return result.rows[0];
    } catch (error: any) {
      this.logger.error(
        `Failed to create user: ${error.message}`,
        error.stack,
      );
      if (error.code === '23505') {
        throw new ConflictException('Email already in use');
      }
      if (error.code === '23503') {
        this.logger.error(
          `Duplicate constraint: ${error.constraint}, detail: ${error.detail}`,
        );
        throw new ConflictException(
          `Duplicate value: ${error.detail || 'unique constraint violation'}`,
        );
      }
      throw new InternalServerErrorException(
        `User creation failed: ${error.message}`,
      );
    }
  }

  async findAll(user: { organization_id: number; role_id: Role }) {
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

  async findOne(id: number, user: { organization_id: number; role_id: Role }) {
    const result = await this.pool.query(
      `SELECT ${SAFE_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );
    if (result.rows.length === 0) throw new NotFoundException('User not found');

    this.verifyOrgAccess(result.rows[0].organization_id, user);
    return result.rows[0];
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    user: { organization_id: number; role_id: Role },
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
    if (dto.is_active !== undefined) {
      fields.push(`is_active = $${i++}`);
      values.push(dto.is_active);
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
    user: { organization_id: number; role_id: Role },
  ) {
    await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, is_active`,
      [id],
    );
    return result.rows[0];
  }

  async reactivate(
  id: number,
  user: { organization_id: number; role_id: Role },
) {
  await this.findOne(id, user);

  const result = await this.pool.query(
    `UPDATE users
     SET is_active = TRUE, updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email, is_active`,
    [id],
  );

  return result.rows[0];
}

  async updateRole(
    id: number,
    roleId: Role,
    user: { organization_id: number; role_id: Role },
  ) {
    if (user.role_id !== Role.SUPER_ADMIN && roleId === Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Only SUPER_ADMIN can assign SUPER_ADMIN role',
      );
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
