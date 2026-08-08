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
    throw new NotFoundException(
      `Sprint ${sprintId} reporting is not available yet.`,
    );
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