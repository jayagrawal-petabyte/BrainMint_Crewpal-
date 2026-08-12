/* eslint-disable */
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AssignTaskDto } from './dto/assign-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @Inject('PG_CONNECTION') private readonly pool: Pool,
  ) {}

  private async verifyProjectAccess(user: any, projectId: string | number) {
    const result = await this.pool.query(
      `SELECT p.id, p.organization_id,
              (pm.user_id IS NOT NULL) AS is_member
       FROM projects p
       LEFT JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = $1
       WHERE p.id = $2 AND p.is_active = TRUE`,
      [user?.id, projectId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Project not found');
    }

    const projectInfo = result.rows[0];

    // Check super admin status safely
    if (user?.role === 'SUPER_ADMIN' || user?.role_id === 1 || user?.role_id === '1') {
      return projectInfo;
    }

    if (String(projectInfo.organization_id) !== String(user?.organization_id)) {
      throw new NotFoundException('Project not found');
    }

    return projectInfo;
  }

  async create(createTaskDto: CreateTaskDto, user: any) {
    const { title, description, priority, projectId, assigneeId } = createTaskDto;

    await this.verifyProjectAccess(user, projectId);

    const userId = user?.id ?? user?.sub;

    try {
      const result = await this.pool.query(
        `INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, created_by)
         VALUES ($1, $2, 'to_do', $3, $4, $5, $6)
         RETURNING *`,
        [title, description ?? null, priority ?? 'medium', projectId, assigneeId ?? null, userId],
      );

      return result.rows[0];
    } catch (error: any) {
      this.logger.error(
        `Failed to create task: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Task creation failed: ${error.message}`,
      );
    }
  }

  async findAll(user: any, projectId?: string | number) {
    if (projectId) {
      await this.verifyProjectAccess(user, projectId);
      const result = await this.pool.query(
        `SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC`,
        [projectId],
      );
      return result.rows;
    }

    const result = await this.pool.query(
      `SELECT t.* FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE p.organization_id = $1
       ORDER BY t.created_at DESC`,
      [user?.organization_id],
    );
    return result.rows;
  }

  async searchTasks(user: any, queryParams: any) {
    const { search, status, priority, assigneeId, projectId, isClosed } = queryParams;

    let query = `
      SELECT t.* FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.organization_id = $1
    `;
    const params: any[] = [user?.organization_id];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (t.title ILIKE $${params.length} OR t.description ILIKE $${params.length})`;
    }

    if (status) {
      params.push(status);
      query += ` AND t.status = $${params.length}`;
    }

    if (priority) {
      params.push(priority);
      query += ` AND t.priority = $${params.length}`;
    }

    if (assigneeId) {
      params.push(assigneeId);
      query += ` AND t.assignee_id = $${params.length}`;
    }

    if (projectId) {
      params.push(projectId);
      query += ` AND t.project_id = $${params.length}`;
    }

    query += ` ORDER BY t.created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findOne(id: string | number, user: any) {
    const result = await this.pool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException('Task not found');
    }

    const task = result.rows[0];
    await this.verifyProjectAccess(user, task.project_id);
    return task;
  }

  async updateStatus(id: string | number, updateTaskStatusDto: UpdateTaskStatusDto, user: any) {
    const task = await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [updateTaskStatusDto.status, task.id],
    );

    return result.rows[0];
  }

  // Alias for tasks.controller.ts calling .update()
  async update(id: string | number, updateDto: any, user: any) {
    return this.updateStatus(id, updateDto, user);
  }

  async assign(id: string | number, assignTaskDto: AssignTaskDto, user: any) {
    const task = await this.findOne(id, user);

    const result = await this.pool.query(
      `UPDATE tasks SET assignee_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [assignTaskDto.assigneeId, task.id],
    );

    return result.rows[0];
  }

  // Alias for tasks.controller.ts calling .assignUser()
  async assignUser(id: string | number, assignDto: any, user: any) {
    return this.assign(id, assignDto, user);
  }

  async remove(id: string | number, user: any) {
    const task = await this.findOne(id, user);

    await this.pool.query(`DELETE FROM tasks WHERE id = $1`, [task.id]);
    return { message: 'Task deleted successfully' };
  }
}
