import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { Role } from '../common/constants/roles.constant';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Injectable()
export class CalendarService {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  async getEvents(
    user: AuthenticatedUser,
    queryParams?: { projectId?: number; month?: number; year?: number },
  ) {
    const isSuperAdmin = user?.role_id === Role.SUPER_ADMIN;
    const isOrgAdmin = user?.role_id === Role.ORG_ADMIN;

    // 1. Query Tasks
    let taskQuery = `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.created_at  AS "createdAt",
        t.updated_at  AS "updatedAt",
        p.id          AS "projectId",
        p.name        AS "projectName"
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.is_active = TRUE
    `;

    const taskParams: any[] = [];

    if (!isSuperAdmin) {
      taskParams.push(user.organization_id);
      taskQuery += ` AND p.organization_id = $${taskParams.length}`;

      if (!isOrgAdmin) {
        taskParams.push(user.id);
        taskQuery += ` AND EXISTS (
          SELECT 1 FROM project_members pm
          WHERE pm.project_id = p.id AND pm.user_id = $${taskParams.length}
        )`;
      }
    }

    if (queryParams?.projectId) {
      taskParams.push(queryParams.projectId);
      taskQuery += ` AND t.project_id = $${taskParams.length}`;
    }

    taskQuery += ` ORDER BY t.created_at DESC LIMIT 100`;

    // 2. Query Sprints
    let sprintQuery = `
      SELECT
        s.id,
        s.name,
        s.goal,
        s.start_date  AS "startDate",
        s.end_date    AS "endDate",
        s.status,
        p.id          AS "projectId",
        p.name        AS "projectName"
      FROM sprints s
      JOIN projects p ON s.project_id = p.id
      WHERE p.is_active = TRUE
    `;

    const sprintParams: any[] = [];

    if (!isSuperAdmin) {
      sprintParams.push(user.organization_id);
      sprintQuery += ` AND p.organization_id = $${sprintParams.length}`;

      if (!isOrgAdmin) {
        sprintParams.push(user.id);
        sprintQuery += ` AND EXISTS (
          SELECT 1 FROM project_members pm
          WHERE pm.project_id = p.id AND pm.user_id = $${sprintParams.length}
        )`;
      }
    }

    if (queryParams?.projectId) {
      sprintParams.push(queryParams.projectId);
      sprintQuery += ` AND s.project_id = $${sprintParams.length}`;
    }

    sprintQuery += ` ORDER BY s.start_date ASC NULLS LAST`;

    const [taskResult, sprintResult] = await Promise.all([
      this.db.query(taskQuery, taskParams),
      this.db.query(sprintQuery, sprintParams),
    ]);

    const taskEvents = taskResult.rows.map((t) => ({
      id: `task-${t.id}`,
      type: 'task',
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      date: t.createdAt,
      projectId: t.projectId,
      projectName: t.projectName,
    }));

    const sprintEvents = sprintResult.rows.map((s) => ({
      id: `sprint-${s.id}`,
      type: 'sprint',
      title: s.name,
      goal: s.goal,
      status: s.status,
      startDate: s.startDate,
      endDate: s.endDate,
      date: s.startDate ?? s.endDate,
      projectId: s.projectId,
      projectName: s.projectName,
    }));

    const allEvents = [...taskEvents, ...sprintEvents];

    return {
      success: true,
      totalEvents: allEvents.length,
      tasks: taskResult.rows,
      sprints: sprintResult.rows,
      events: allEvents,
    };
  }
}
