/* eslint-disable */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { TaskStatus } from './dto/create-task.dto';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export { TaskStatus };

export const TASK_COLUMNS =
  't.id, t.title, t.description, t.status, t.priority, t.project_id, t.assignee_id, t.created_at';

@Injectable()
export class TasksService {
  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  async create(createTaskDto: any, user?: any) {
    const { title, description, priority, projectId, assigneeId } = createTaskDto;
    const result = await this.pool.query(
      `INSERT INTO tasks (title, description, status, priority, project_id, assignee_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        description,
        TaskStatus.TODO,
        priority || 'MEDIUM',
        projectId,
        assigneeId || null,
      ],
    );
    return result.rows[0];
  }

  async findAll(user: any) {
    let query = `SELECT ${TASK_COLUMNS} FROM tasks t JOIN projects p ON p.id = t.project_id`;
    const values: any[] = [];

    if (user.role_id !== Role.SUPER_ADMIN) {
      query += ` WHERE p.organization_id = $1`;
      values.push(user.organization_id);
    }

    query += ` ORDER BY t.created_at DESC`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async findOne(id: number, user?: any) {
    const result = await this.pool.query(
      `SELECT ${TASK_COLUMNS} 
       FROM tasks t 
       JOIN projects p ON p.id = t.project_id 
       WHERE t.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async update(id: number, updateTaskDto: any, user?: any) {
    const { title, description, priority, projectId, assigneeId } = updateTaskDto;
    const result = await this.pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           priority = COALESCE($3, priority),
           project_id = COALESCE($4, project_id),
           assignee_id = COALESCE($5, assignee_id)
       WHERE id = $6
       RETURNING *`,
      [title, description, priority, projectId, assigneeId, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async updateStatus(id: number, status: TaskStatus, user?: any) {
    const result = await this.pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async assignUser(id: number, assigneeId: number, user?: any) {
    const result = await this.pool.query(
      `UPDATE tasks SET assignee_id = $1 WHERE id = $2 RETURNING *`,
      [assigneeId, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async remove(id: number, user?: any) {
    const result = await this.pool.query(
      `DELETE FROM tasks WHERE id = $1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return { message: `Task ${id} successfully deleted` };
  }

  async searchTasks(
    filters: {
      search?: string;
      status?: TaskStatus;
      priority?: string;
      projectId?: number;
      assigneeId?: number;
    },
    user: { id: number; organization_id: number; role_id: Role },
  ) {
    const conditions: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (user.role_id !== Role.SUPER_ADMIN) {
      conditions.push(`p.organization_id = $${index}`);
      values.push(user.organization_id);
      index++;
    }

    if (filters.search) {
      conditions.push(
        `(t.title ILIKE $${index} OR t.description ILIKE $${index})`,
      );
      values.push(`%${filters.search}%`);
      index++;
    }

    if (filters.status) {
      conditions.push(`t.status = $${index}`);
      values.push(filters.status);
      index++;
    }

    if (filters.priority) {
      conditions.push(`t.priority = $${index}`);
      values.push(filters.priority);
      index++;
    }

    if (filters.projectId) {
      conditions.push(`t.project_id = $${index}`);
      values.push(filters.projectId);
      index++;
    }

    if (filters.assigneeId) {
      conditions.push(`t.assignee_id = $${index}`);
      values.push(filters.assigneeId);
      index++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await this.pool.query(
      `SELECT ${TASK_COLUMNS}
       FROM tasks t
       JOIN projects p ON p.id = t.project_id
       ${whereClause}
       ORDER BY t.created_at DESC`,
      values,
    );

    return result.rows;
  }
}