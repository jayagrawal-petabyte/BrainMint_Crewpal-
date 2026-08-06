import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
} from './dto/create-task.dto';
import { Role } from '../common/constants/roles.constant';

const TASK_COLUMNS = `
  t.id, t.project_id, t.sprint_id, t.board_id,
  t.assignee_id, t.created_by, t.title, t.description,
  t.status, t.priority, t.is_closed,
  t.created_at, t.updated_at
`;

@Injectable()
export class TasksService {
  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  private async verifyProjectAccess(
    projectId: number,
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    const result = await this.pool.query(
      `SELECT p.id, p.organization_id
       FROM projects p
       WHERE p.id = $1 AND p.is_active = TRUE`,
      [projectId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Project not found');
    }

    if (
      user.role_id !== Role.SUPER_ADMIN &&
      result.rows[0].organization_id !== user.organization_id
    ) {
      throw new NotFoundException('Project not found');
    }

    return result.rows[0];
  }

  private async verifyTaskAccess(
    taskId: number,
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    const result = await this.pool.query(
      `SELECT t.id, t.project_id, t.created_by, p.organization_id
       FROM tasks t
       JOIN projects p ON p.id = t.project_id
       WHERE t.id = $1`,
      [taskId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Task not found');
    }

    if (
      user.role_id !== Role.SUPER_ADMIN &&
      result.rows[0].organization_id !== user.organization_id
    ) {
      throw new NotFoundException('Task not found');
    }

    return result.rows[0];
  }

  async create(
    dto: CreateTaskDto,
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    await this.verifyProjectAccess(dto.projectId, user);

    const result = await this.pool.query(
      `INSERT INTO tasks (project_id, sprint_id, assignee_id, created_by, title, description, status, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${TASK_COLUMNS}`,
      [
        dto.projectId,
        dto.sprintId ?? null,
        dto.assigneeId ?? null,
        user.id,
        dto.title,
        dto.description ?? null,
        dto.status ?? 'to_do',
        dto.priority ?? 'medium',
      ],
    );

    return result.rows[0];
  }

  async findAll(user: { id: number; organization_id: number; role_id: Role }) {
    if (user.role_id === Role.SUPER_ADMIN) {
      const result = await this.pool.query(
        `SELECT ${TASK_COLUMNS} FROM tasks t ORDER BY t.id`,
      );
      return result.rows;
    }

    const result = await this.pool.query(
      `SELECT ${TASK_COLUMNS}
       FROM tasks t
       JOIN projects p ON p.id = t.project_id
       WHERE p.organization_id = $1
       ORDER BY t.id`,
      [user.organization_id],
    );
    return result.rows;
  }

  async findOne(
    id: number,
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    await this.verifyTaskAccess(id, user);

    const result = await this.pool.query(
      `SELECT ${TASK_COLUMNS} FROM tasks t WHERE t.id = $1`,
      [id],
    );
    return result.rows[0];
  }

  async update(
    id: number,
    dto: UpdateTaskDto,
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    await this.verifyTaskAccess(id, user);

    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (dto.title !== undefined) {
      fields.push(`title = $${i++}`);
      values.push(dto.title);
    }
    if (dto.description !== undefined) {
      fields.push(`description = $${i++}`);
      values.push(dto.description);
    }
    if (dto.priority !== undefined) {
      fields.push(`priority = $${i++}`);
      values.push(dto.priority);
    }
    if (dto.sprintId !== undefined) {
      fields.push(`sprint_id = $${i++}`);
      values.push(dto.sprintId);
    }

    if (fields.length === 0) return this.findOne(id, user);

    fields.push('updated_at = NOW()');
    values.push(id);

    const result = await this.pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${TASK_COLUMNS}`,
      values,
    );
    return result.rows[0];
  }

  async updateStatus(
    id: number,
    status: TaskStatus,
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    await this.verifyTaskAccess(id, user);

    const result = await this.pool.query(
      `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING ${TASK_COLUMNS}`,
      [status, id],
    );
    return result.rows[0];
  }

  async assignUser(
    id: number,
    assigneeId: number,
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    await this.verifyTaskAccess(id, user);

    const result = await this.pool.query(
      `UPDATE tasks SET assignee_id = $1, updated_at = NOW() WHERE id = $2 RETURNING ${TASK_COLUMNS}`,
      [assigneeId, id],
    );
    return result.rows[0];
  }

  async remove(
    id: number,
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    const task = await this.verifyTaskAccess(id, user);

    if (user.role_id > Role.PROJECT_MANAGER && task.created_by !== user.id) {
      throw new ForbiddenException('Not authorized to delete this task');
    }

    await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return { message: 'Task deleted successfully' };
  }
}
