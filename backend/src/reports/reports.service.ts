import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';

import { ProjectReport } from './interfaces/project-report.interface';
import { SprintReport } from './interfaces/sprint-report.interface';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('PG_CONNECTION')
    private readonly db: Pool,
  ) {}

  async getOrganizationReport(user: any) {
    const isSuperAdmin = user?.role_id === 1 || user?.role === 'SUPER_ADMIN';
    const orgId = user?.organization_id;

    let projectQuery = `
      SELECT p.id, p.name, p.status, p.created_at,
             COUNT(t.id) AS "totalTasks",
             COUNT(t.id) FILTER (WHERE t.status = 'done') AS "completedTasks"
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE p.is_active = TRUE
    `;

    const params: any[] = [];
    if (!isSuperAdmin && orgId) {
      params.push(orgId);
      projectQuery += ` AND p.organization_id = $${params.length}`;
    }

    if (!isSuperAdmin && user?.role_id > 2) {
      params.push(user.id);
      projectQuery += ` AND EXISTS (
        SELECT 1 FROM project_members pm
        WHERE pm.project_id = p.id AND pm.user_id = $${params.length}
      )`;
    }

    projectQuery += ` GROUP BY p.id, p.name, p.status, p.created_at ORDER BY p.id`;

    const projectResult = await this.db.query(projectQuery, params);

    let totalTasks = 0;
    let completedTasks = 0;

    const projectProgress = projectResult.rows.map((row: any) => {
      const pTotal = Number(row.totalTasks);
      const pDone = Number(row.completedTasks);
      totalTasks += pTotal;
      completedTasks += pDone;
      const progress =
        pTotal > 0 ? Number(((pDone / pTotal) * 100).toFixed(2)) : 0;
      return {
        id: row.id,
        name: row.name,
        status: row.status ?? 'active',
        totalTasks: pTotal,
        completedTasks: pDone,
        progress,
      };
    });

    const activeProjects = projectResult.rows.filter(
      (p: any) =>
        p.status === 'active' || p.status === 'in_progress' || !p.status,
    ).length;

    const completedProjects = projectResult.rows.filter(
      (p: any) => p.status === 'completed',
    ).length;

    return {
      summary: {
        totalProjects: projectResult.rows.length,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        overallProgress:
          totalTasks > 0
            ? Number(((completedTasks / totalTasks) * 100).toFixed(2))
            : 0,
      },
      projectProgress,
    };
  }

  async getProjectReport(
    projectId: number,
  ): Promise<ProjectReport> {
    const project = await this.getProject(projectId);

    const [memberCount, taskStatistics] = await Promise.all([
      this.getMemberCount(projectId),
      this.getTaskStatistics(projectId),
    ]);

    const completionPercentage =
      this.calculateCompletionPercentage(
        taskStatistics.done,
        taskStatistics.totalTasks,
      );

    return {
      project,
      summary: {
        totalMembers: memberCount,
        totalTasks: taskStatistics.totalTasks,
        completedTasks: taskStatistics.done,
        remainingTasks:
          taskStatistics.totalTasks - taskStatistics.done,
        completionPercentage,
      },
      taskStatus: taskStatistics,
    };
  }

  async getSprintReport(
    sprintId: number,
  ): Promise<SprintReport> {
    const sprintResult = await this.db.query(
      `SELECT id, project_id, name, start_date, end_date, status
       FROM sprints
       WHERE id = $1`,
      [sprintId],
    );

    if (sprintResult.rows.length === 0) {
      throw new NotFoundException(
        `Sprint ${sprintId} not found`,
      );
    }

    const sprint = sprintResult.rows[0];

    const taskStatsResult = await this.db.query(
      `SELECT
         COUNT(*) AS "totalTasks",
         COUNT(*) FILTER (WHERE status = 'to_do') AS "todo",
         COUNT(*) FILTER (WHERE status = 'in_progress') AS "inProgress",
         COUNT(*) FILTER (WHERE status = 'in_review') AS "inReview",
         COUNT(*) FILTER (WHERE status = 'testing') AS "testing",
         COUNT(*) FILTER (WHERE status = 'done') AS "done"
       FROM tasks
       WHERE sprint_id = $1`,
      [sprintId],
    );

    const stats = {
      totalTasks: Number(taskStatsResult.rows[0].totalTasks),
      todo: Number(taskStatsResult.rows[0].todo),
      inProgress: Number(taskStatsResult.rows[0].inProgress),
      inReview: Number(taskStatsResult.rows[0].inReview),
      testing: Number(taskStatsResult.rows[0].testing),
      done: Number(taskStatsResult.rows[0].done),
    };

    const completionPercentage =
      this.calculateCompletionPercentage(
        stats.done,
        stats.totalTasks,
      );

    return {
      sprint,
      summary: {
        totalTasks: stats.totalTasks,
        completedTasks: stats.done,
        remainingTasks: stats.totalTasks - stats.done,
        completionPercentage,
      },
      taskStatus: stats,
    };
  }

  private async getProject(projectId: number) {
    const query = `
      SELECT
        id,
        name,
        description,
        is_active,
        created_at
      FROM projects
      WHERE id = $1
    `;

    const result = await this.db.query(query, [projectId]);

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Project ${projectId} not found`,
      );
    }

    return result.rows[0];
  }

  private async getMemberCount(
    projectId: number,
  ): Promise<number> {
    const query = `
      SELECT COUNT(*) AS total_members
      FROM project_members
      WHERE project_id = $1
    `;

    const result = await this.db.query(query, [projectId]);

    return Number(result.rows[0].total_members);
  }

  private async getTaskStatistics(
    projectId: number,
  ) {
    const query = `
      SELECT
        COUNT(*) AS "totalTasks",
        COUNT(*) FILTER (WHERE status = 'to_do') AS "todo",
        COUNT(*) FILTER (WHERE status = 'in_progress') AS "inProgress",
        COUNT(*) FILTER (WHERE status = 'in_review') AS "inReview",
        COUNT(*) FILTER (WHERE status = 'testing') AS "testing",
        COUNT(*) FILTER (WHERE status = 'done') AS "done"
      FROM tasks
      WHERE project_id = $1
    `;

    const result = await this.db.query(query, [projectId]);

    return {
      totalTasks: Number(result.rows[0].totalTasks),
      todo: Number(result.rows[0].todo),
      inProgress: Number(result.rows[0].inProgress),
      inReview: Number(result.rows[0].inReview),
      testing: Number(result.rows[0].testing),
      done: Number(result.rows[0].done),
    };
  }

  private calculateCompletionPercentage(
    completed: number,
    total: number,
  ): number {
    if (total === 0) {
      return 0;
    }

    return Number(
      ((completed / total) * 100).toFixed(2),
    );
  }
}