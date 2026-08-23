import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { Role } from '../common/constants/roles.constant';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Injectable()
export class SprintsService {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  // ─────────────────────────────────────────────────────────────
  // PRIVATE HELPERS (Security & Scope Gates)
  // ─────────────────────────────────────────────────────────────

  /**
   * Verify the requesting user has access to the given sprint.
   *
   * Defense-in-depth:
   *  1. NotFoundException for cross-tenant access (prevent resource enumeration).
   *  2. ForbiddenException for non-member access on project-level roles (3–9).
   */
  private async verifySprintAccess(sprintId: number, user: AuthenticatedUser) {
    if (!sprintId || isNaN(sprintId)) {
      throw new BadRequestException('Invalid sprint ID');
    }

    const result = await this.db.query(
      `SELECT
         s.id,
         s.project_id,
         s.status,
         p.organization_id,
         (pm.user_id IS NOT NULL) AS is_member
       FROM sprints s
       JOIN projects p ON p.id = s.project_id
       LEFT JOIN project_members pm
         ON pm.project_id = s.project_id AND pm.user_id = $1
       WHERE s.id = $2`,
      [user.id, sprintId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Sprint not found');
    }

    const sprint = result.rows[0];

    // Layer 1 — Super Admin: org-wide access
    if (user.role_id === Role.SUPER_ADMIN) {
      return sprint;
    }

    // Layer 1 — Tenant isolation
    if (sprint.organization_id !== user.organization_id) {
      throw new NotFoundException('Sprint not found');
    }

    // Layer 2 — Org Admin: full access within org
    if (user.role_id === Role.ORG_ADMIN) {
      return sprint;
    }

    // Layer 2 — Project membership check (Roles 3–9)
    if (!sprint.is_member) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    return sprint;
  }

  /**
   * Verify access to a specific project.
   */
  private async verifyProjectAccess(projectId: number, user: AuthenticatedUser) {
    if (!projectId || isNaN(projectId)) {
      throw new BadRequestException('Invalid project ID');
    }

    const result = await this.db.query(
      `SELECT
         p.id,
         p.organization_id,
         (pm.user_id IS NOT NULL) AS is_member
       FROM projects p
       LEFT JOIN project_members pm
         ON pm.project_id = p.id AND pm.user_id = $1
       WHERE p.id = $2 AND p.is_active = TRUE`,
      [user.id, projectId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Project not found');
    }

    const project = result.rows[0];

    if (user.role_id === Role.SUPER_ADMIN) return project;
    if (project.organization_id !== user.organization_id) {
      throw new NotFoundException('Project not found');
    }
    if (user.role_id === Role.ORG_ADMIN) return project;

    if (!project.is_member) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    return project;
  }

  /**
   * Verify task exists, belongs to the same project as the sprint,
   * and requester has access to it.
   */
  private async verifyTaskBelongsToSprint(
    taskId: number,
    sprintProjectId: number,
    user: AuthenticatedUser,
    requireLinkedToSprint?: number,
  ) {
    if (!taskId || isNaN(taskId)) {
      throw new BadRequestException('Invalid task ID');
    }

    const result = await this.db.query(
      `SELECT t.id, t.project_id, t.sprint_id, p.organization_id
       FROM tasks t
       JOIN projects p ON p.id = t.project_id
       WHERE t.id = $1`,
      [taskId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Task not found');
    }

    const task = result.rows[0];

    if (
      user.role_id !== Role.SUPER_ADMIN &&
      task.organization_id !== user.organization_id
    ) {
      throw new NotFoundException('Task not found');
    }

    if (task.project_id !== sprintProjectId) {
      throw new BadRequestException(
        'Task does not belong to the same project as this sprint',
      );
    }

    if (requireLinkedToSprint !== undefined) {
      if (task.sprint_id !== requireLinkedToSprint) {
        throw new BadRequestException(
          'Task is not currently assigned to this sprint',
        );
      }
    }

    return task;
  }

  // ─────────────────────────────────────────────────────────────
  // PUBLIC CRUD METHODS
  // ─────────────────────────────────────────────────────────────

  /**
   * GET /sprints
   * List sprints accessible to the authenticated user.
   */
  async findAll(
    user: AuthenticatedUser,
    queryParams?: { projectId?: number; status?: string },
  ) {
    let query = `
      SELECT
        s.id,
        s.project_id  AS "projectId",
        s.name,
        s.goal,
        s.start_date  AS "startDate",
        s.end_date    AS "endDate",
        s.status,
        s.created_at  AS "createdAt",
        s.updated_at  AS "updatedAt"
      FROM sprints s
      JOIN projects p ON s.project_id = p.id
    `;

    const params: any[] = [];
    const conditions: string[] = ['p.is_active = TRUE'];

    if (user.role_id === Role.SUPER_ADMIN) {
      // Super Admin sees all
    } else if (user.role_id === Role.ORG_ADMIN) {
      params.push(user.organization_id);
      conditions.push(`p.organization_id = $${params.length}`);
    } else {
      params.push(user.organization_id);
      conditions.push(`p.organization_id = $${params.length}`);

      params.push(user.id);
      conditions.push(`EXISTS (
        SELECT 1 FROM project_members pm
        WHERE pm.project_id = s.project_id AND pm.user_id = $${params.length}
      )`);
    }

    if (queryParams?.projectId) {
      params.push(queryParams.projectId);
      conditions.push(`s.project_id = $${params.length}`);
    }

    if (queryParams?.status) {
      params.push(queryParams.status);
      conditions.push(`s.status = $${params.length}`);
    }

    query += ` WHERE ${conditions.join(' AND ')} ORDER BY s.created_at DESC`;

    const result = await this.db.query(query, params);
    return result.rows;
  }

  /**
   * GET /sprints/:id
   */
  async findOne(id: number, user: AuthenticatedUser) {
    await this.verifySprintAccess(id, user);

    const result = await this.db.query(
      `SELECT
         s.id,
         s.project_id  AS "projectId",
         s.name,
         s.goal,
         s.start_date  AS "startDate",
         s.end_date    AS "endDate",
         s.status,
         s.created_at  AS "createdAt",
         s.updated_at  AS "updatedAt"
       FROM sprints s
       WHERE s.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Sprint not found');
    }

    return result.rows[0];
  }

  /**
   * POST /sprints
   */
  async create(dto: CreateSprintDto, user: AuthenticatedUser) {
    if (user.role_id === Role.CLIENT || user.role_id === Role.VIEWER) {
      throw new ForbiddenException(
        'Your role does not have permission to create sprints',
      );
    }

    let targetProjectId = dto.projectId;

    if (!targetProjectId) {
      if (user.role_id === Role.SUPER_ADMIN || user.role_id === Role.ORG_ADMIN) {
        const defaultProj = await this.db.query(
          `SELECT id FROM projects WHERE organization_id = $1 AND is_active = TRUE ORDER BY id LIMIT 1`,
          [user.organization_id || 1],
        );
        if (defaultProj.rows.length > 0) targetProjectId = defaultProj.rows[0].id;
      } else {
        const memberProj = await this.db.query(
          `SELECT project_id FROM project_members WHERE user_id = $1 LIMIT 1`,
          [user.id],
        );
        if (memberProj.rows.length > 0) targetProjectId = memberProj.rows[0].project_id;
      }
    }

    if (!targetProjectId) {
      throw new BadRequestException('Project ID is required to create a sprint');
    }

    await this.verifyProjectAccess(targetProjectId, user);

    const result = await this.db.query(
      `INSERT INTO sprints (
         project_id,
         name,
         goal,
         start_date,
         end_date,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING
         id,
         project_id  AS "projectId",
         name,
         goal,
         start_date  AS "startDate",
         end_date    AS "endDate",
         status,
         created_at  AS "createdAt",
         updated_at  AS "updatedAt"`,
      [
        targetProjectId,
        dto.name,
        dto.goal ?? null,
        dto.startDate ?? null,
        dto.endDate ?? null,
        dto.status ?? 'planned',
      ],
    );

    return result.rows[0];
  }

  /**
   * PATCH /sprints/:id
   */
  async update(id: number, dto: UpdateSprintDto, user: AuthenticatedUser) {
    if (user.role_id === Role.CLIENT || user.role_id === Role.VIEWER) {
      throw new ForbiddenException(
        'Your role does not have permission to update sprints',
      );
    }

    await this.verifySprintAccess(id, user);

    const result = await this.db.query(
      `UPDATE sprints
       SET
         name = COALESCE($1, name),
         goal = COALESCE($2, goal),
         start_date = COALESCE($3, start_date),
         end_date = COALESCE($4, end_date),
         status = COALESCE($5, status),
         updated_at = NOW()
       WHERE id = $6
       RETURNING
         id,
         project_id  AS "projectId",
         name,
         goal,
         start_date  AS "startDate",
         end_date    AS "endDate",
         status,
         created_at  AS "createdAt",
         updated_at  AS "updatedAt"`,
      [
        dto.name ?? null,
        dto.goal ?? null,
        dto.startDate ?? null,
        dto.endDate ?? null,
        dto.status ?? null,
        id,
      ],
    );

    return result.rows[0];
  }

  /**
   * DELETE /sprints/:id
   */
  async delete(id: number, user: AuthenticatedUser) {
    if (user.role_id === Role.CLIENT || user.role_id === Role.VIEWER) {
      throw new ForbiddenException(
        'Your role does not have permission to delete sprints',
      );
    }

    await this.verifySprintAccess(id, user);

    // Unlink any tasks linked to this sprint
    await this.db.query(
      `UPDATE tasks SET sprint_id = NULL, updated_at = NOW() WHERE sprint_id = $1`,
      [id],
    );

    await this.db.query(`DELETE FROM sprints WHERE id = $1`, [id]);

    return { message: 'Sprint deleted successfully' };
  }

  // ─────────────────────────────────────────────────────────────
  // SPRINT-TASK LINKAGE METHODS
  // ─────────────────────────────────────────────────────────────

  /**
   * GET /sprints/:sprintId/tasks
   */
  async getSprintTasks(sprintId: number, user: AuthenticatedUser) {
    const sprint = await this.verifySprintAccess(sprintId, user);

    const result = await this.db.query(
      `SELECT
         t.id,
         t.project_id    AS "projectId",
         t.sprint_id     AS "sprintId",
         t.assignee_id   AS "assigneeId",
         t.created_by    AS "createdBy",
         t.title,
         t.description,
         t.status,
         t.priority,
         t.is_closed     AS "isClosed",
         t.created_at    AS "createdAt",
         t.updated_at    AS "updatedAt"
       FROM tasks t
       WHERE t.sprint_id = $1
       ORDER BY t.created_at ASC`,
      [sprintId],
    );

    return {
      sprintId,
      projectId: sprint.project_id,
      total: result.rows.length,
      tasks: result.rows,
    };
  }

  /**
   * POST /sprints/:sprintId/tasks
   */
  async linkTask(sprintId: number, taskId: number, user: AuthenticatedUser) {
    if (user.role_id === Role.CLIENT || user.role_id === Role.VIEWER) {
      throw new ForbiddenException(
        'Your role does not have permission to assign tasks to sprints',
      );
    }

    const sprint = await this.verifySprintAccess(sprintId, user);
    await this.verifyTaskBelongsToSprint(taskId, sprint.project_id, user);

    const result = await this.db.query(
      `UPDATE tasks
       SET sprint_id = $1, updated_at = NOW()
       WHERE id = $2 AND project_id = $3
       RETURNING
         id,
         project_id  AS "projectId",
         sprint_id   AS "sprintId",
         title,
         status,
         priority,
         updated_at  AS "updatedAt"`,
      [sprintId, taskId, sprint.project_id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(
        'Task not found or no longer belongs to the same project',
      );
    }

    return {
      message: 'Task assigned to sprint successfully',
      task: result.rows[0],
    };
  }

  /**
   * DELETE /sprints/:sprintId/tasks/:taskId
   */
  async unlinkTask(sprintId: number, taskId: number, user: AuthenticatedUser) {
    if (user.role_id === Role.CLIENT || user.role_id === Role.VIEWER) {
      throw new ForbiddenException(
        'Your role does not have permission to remove tasks from sprints',
      );
    }

    const sprint = await this.verifySprintAccess(sprintId, user);
    await this.verifyTaskBelongsToSprint(
      taskId,
      sprint.project_id,
      user,
      sprintId,
    );

    const result = await this.db.query(
      `UPDATE tasks
       SET sprint_id = NULL, updated_at = NOW()
       WHERE id = $1 AND project_id = $2 AND sprint_id = $3
       RETURNING
         id,
         project_id  AS "projectId",
         sprint_id   AS "sprintId",
         title,
         status,
         priority,
         updated_at  AS "updatedAt"`,
      [taskId, sprint.project_id, sprintId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(
        'Task not found or is no longer assigned to this sprint',
      );
    }

    return {
      message: 'Task removed from sprint and returned to backlog',
      task: result.rows[0],
    };
  }
}
