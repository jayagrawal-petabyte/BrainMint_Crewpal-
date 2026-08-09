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

// Status lane ordering for the scrum board view
const TASK_STATUS_LANES = [
  'to_do',
  'in_progress',
  'in_review',
  'testing',
  'done',
] as const;

@Injectable()
export class BoardsService {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  // ─────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────

  /**
   * Verify the requesting user has access to the given board.
    * Verify the requesting user has access to the given board.
    * Also validates that the board is of type 'scrum' — the type is checked
    * after retrieval (hard-coded comparison), so a user cannot bypass it
    * by crafting a different boardId.
   * Security layers:
   *  1. NotFoundException for cross-tenant access (no information leakage).
   *  2. ForbiddenException for intra-org non-member access.
   *  3. NotFoundException if the board is not a Scrum board (no type confusion).
   */
  private async verifyBoardAccess(boardId: number, user: AuthenticatedUser) {
    if (!boardId || isNaN(boardId)) {
      throw new BadRequestException('Invalid board ID');
    }

    const result = await this.db.query(
      `SELECT
         b.id,
         b.project_id,
         b.name,
         b.type,
         p.organization_id,
         (pm.user_id IS NOT NULL) AS is_member
       FROM boards b
       JOIN projects p ON p.id = b.project_id
       LEFT JOIN project_members pm
         ON pm.project_id = b.project_id AND pm.user_id = $1
       WHERE b.id = $2`,
      [user.id, boardId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Board not found');
    }

    const board = result.rows[0];

    // Layer 1 — Super Admin: cross-org access permitted
    if (user.role_id === Role.SUPER_ADMIN) {
      // Still enforce scrum-type check for Super Admin
      if (board.type !== 'scrum') {
        throw new NotFoundException('Scrum board not found');
      }
      return board;
    }

    // Layer 1 — Org isolation: NotFoundException to avoid resource enumeration
    if (board.organization_id !== user.organization_id) {
      throw new NotFoundException('Board not found');
    }

    // Layer 3 — Board type guard: only serve Scrum boards through this endpoint
    // Hard-coded comparison; user input (boardId) cannot alter the board type
    if (board.type !== 'scrum') {
      throw new NotFoundException('Scrum board not found');
    }

    // Layer 2 — Org Admin: full access within their org
    if (user.role_id === Role.ORG_ADMIN) {
      return board;
    }

    // Layer 2 — Project membership gate (Roles 3–9, including Client and Viewer)
    // All authenticated project members can view the scrum board (read-only)
    if (!board.is_member) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    return board;
  }

  // ─────────────────────────────────────────────────────────────
  // PUBLIC METHODS
  // ─────────────────────────────────────────────────────────────

  /**
   * GET /boards/:boardId/scrum-view
   * Returns the full Scrum board view:
   *  - Board metadata
   *  - Active sprint details (or null if no active sprint)
   *  - Tasks grouped by status lane (only for active sprint)
   *  - Product backlog (tasks with sprint_id IS NULL for this project)
   *  - Progress stats: counts per status and overall % completion
   *
   * This endpoint is read-only. All 9 roles that are project members can access it.
   * Status mutations are owned by the Task module — never done here.
   */
  async getScrumView(boardId: number, user: AuthenticatedUser) {
    // Verify board access (IDOR + type + membership)
    const board = await this.verifyBoardAccess(boardId, user);

    // Fetch the active sprint for this project
    const sprintResult = await this.db.query(
      `SELECT
         id,
         name,
         start_date  AS "startDate",
         end_date    AS "endDate",
         status,
         created_at  AS "createdAt"
       FROM sprints
       WHERE project_id = $1 AND status = 'active'
       LIMIT 1`,
      [board.project_id],
    );

    const activeSprint = sprintResult.rows[0] ?? null;

    // Build status lanes for the active sprint
    let lanes: Record<string, object[]> = {};
    let stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
      completionPercent: 0,
    };

    if (activeSprint) {
      // Fetch all tasks in the active sprint in a single query
      const taskResult = await this.db.query(
        `SELECT
           t.id,
           t.title,
           t.description,
           t.status,
           t.priority,
           t.is_closed      AS "isClosed",
           t.assignee_id    AS "assigneeId",
           u.name           AS "assigneeName",
           t.created_at     AS "createdAt",
           t.updated_at     AS "updatedAt"
         FROM tasks t
         LEFT JOIN users u ON u.id = t.assignee_id
         WHERE t.sprint_id = $1
         ORDER BY t.priority DESC, t.created_at ASC`,
        [activeSprint.id],
      );

      const allTasks = taskResult.rows;
      stats.total = allTasks.length;

      // Group tasks into status lanes
      lanes = Object.fromEntries(TASK_STATUS_LANES.map((s) => [s, []]));
      for (const task of allTasks) {
        if (lanes[task.status]) {
          (lanes[task.status] as object[]).push(task);
        }
        stats.byStatus[task.status] = (stats.byStatus[task.status] ?? 0) + 1;
      }

      // Completion % = done tasks / total tasks (0 if no tasks)
      const doneCount = stats.byStatus['done'] ?? 0;
      stats.completionPercent =
        stats.total > 0
          ? Math.round((doneCount / stats.total) * 100)
          : 0;
    } else {
      // No active sprint — return empty lanes structure
      lanes = Object.fromEntries(TASK_STATUS_LANES.map((s) => [s, []]));
    }

    // Fetch product backlog: tasks belonging to this project with no sprint assignment
    // Data minimization: return only fields needed for backlog display
    const backlogResult = await this.db.query(
      `SELECT
         t.id,
         t.title,
         t.description,
         t.status,
         t.priority,
         t.is_closed      AS "isClosed",
         t.assignee_id    AS "assigneeId",
         u.name           AS "assigneeName",
         t.created_at     AS "createdAt"
       FROM tasks t
       LEFT JOIN users u ON u.id = t.assignee_id
       WHERE t.project_id = $1
         AND t.sprint_id IS NULL
         AND t.is_closed = FALSE
       ORDER BY t.priority DESC, t.created_at ASC`,
      [board.project_id],
    );

    return {
      board: {
        id: board.id,
        name: board.name,
        projectId: board.project_id,
      },
      activeSprint,
      lanes,
      stats: activeSprint ? stats : null,
      backlog: {
        total: backlogResult.rows.length,
        tasks: backlogResult.rows,
      },
    };
  }
}
