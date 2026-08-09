import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { Role } from '../common/constants/roles.constant';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role_id: Role;
  organization_id: number;
}

@Injectable()
export class SprintsService {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) { }

  // PRIVATE HELPERS

  /**
   * Verify the requesting user has access to the given sprint.
   *
   * Security layers:
   *  1. NotFoundException for cross-tenant access (no information leakage).
   *  2. ForbiddenException for intra-org non-member access (user already
   *     knows they're in the org).
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

    // Layer 1 — Super Admin: cross-org access permitted
    if (user.role_id === Role.SUPER_ADMIN) {
      return sprint;
    }

    // Layer 1 — Org isolation: NotFoundException to avoid resource enumeration
    if (sprint.organization_id !== user.organization_id) {
      throw new NotFoundException('Sprint not found');
    }

    // Layer 2 — Org Admin: full access within their org
    if (user.role_id === Role.ORG_ADMIN) {
      return sprint;
    }

    // Layer 2 — Project membership gate (Roles 3–9)
    if (!sprint.is_member) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    return sprint;
  }

  /**
   * Verify the task exists, belongs to the same project as the sprint,
   * and the requesting user has access to it.
   * Done in a single query to prevent TOCTOU races.
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

    // Cross-org task access — never confirm existence to another tenant
    if (
      user.role_id !== Role.SUPER_ADMIN &&
      task.organization_id !== user.organization_id
    ) {
      throw new NotFoundException('Task not found');
    }

    // Layer 3 — Task and sprint must belong to the same project
    // This prevents cross-project task assignments which break sprint integrity
    if (task.project_id !== sprintProjectId) {
      throw new BadRequestException(
        'Task does not belong to the same project as this sprint',
      );
    }

    // When unlinking, verify the task is actually linked to this specific sprint
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
  // PUBLIC METHODS
  // ─────────────────────────────────────────────────────────────

  /**
   * GET /sprints/:sprintId/tasks
   * List all tasks linked to the sprint.
   * All authenticated project members can read (including Client and Viewer).
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
   * Assign a task to the sprint by updating tasks.sprint_id.
   * Blocked for Client (8) and Viewer (9).
   */
  async linkTask(
    sprintId: number,
    taskId: number,
    user: AuthenticatedUser,
  ) {
    // Layer 4 — Write gate: Client and Viewer are read-only
    if (user.role_id === Role.CLIENT || user.role_id === Role.VIEWER) {
      throw new ForbiddenException(
        'Your role does not have permission to assign tasks to sprints',
      );
    }

    // Layer 1 + 2 — IDOR + membership check on sprint
    const sprint = await this.verifySprintAccess(sprintId, user);

    // Layer 3 — Task must belong to the same project as the sprint
    await this.verifyTaskBelongsToSprint(taskId, sprint.project_id, user);

    // Write: assign task to sprint
    const result = await this.db.query(
      `UPDATE tasks
       SET sprint_id = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING
         id,
         project_id  AS "projectId",
         sprint_id   AS "sprintId",
         title,
         status,
         priority,
         updated_at  AS "updatedAt"`,
      [sprintId, taskId],
    );

    return {
      message: 'Task assigned to sprint successfully',
      task: result.rows[0],
    };
  }

  /**
   * DELETE /sprints/:sprintId/tasks/:taskId
   * Unlink a task from the sprint (set tasks.sprint_id = NULL).
   * Blocked for Client (8) and Viewer (9).
   */
  async unlinkTask(
    sprintId: number,
    taskId: number,
    user: AuthenticatedUser,
  ) {
    // Layer 4 — Write gate: Client and Viewer are read-only
    if (user.role_id === Role.CLIENT || user.role_id === Role.VIEWER) {
      throw new ForbiddenException(
        'Your role does not have permission to remove tasks from sprints',
      );
    }

    // Layer 1 + 2 — IDOR + membership check on sprint
    const sprint = await this.verifySprintAccess(sprintId, user);

    // Layer 3 — Task must be in same project AND currently linked to this sprint
    await this.verifyTaskBelongsToSprint(
      taskId,
      sprint.project_id,
      user,
      sprintId, // requireLinkedToSprint
    );

    // Write: remove task from sprint (return to backlog)
    const result = await this.db.query(
      `UPDATE tasks
       SET sprint_id = NULL, updated_at = NOW()
       WHERE id = $1
       RETURNING
         id,
         project_id  AS "projectId",
         sprint_id   AS "sprintId",
         title,
         status,
         priority,
         updated_at  AS "updatedAt"`,
      [taskId],
    );

    return {
      message: 'Task removed from sprint and returned to backlog',
      task: result.rows[0],
    };
  }
}
