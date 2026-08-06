import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { DashboardData } from './interfaces/dashboard.interface';
import { Role } from '../common/constants/roles.constant';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('PG_CONNECTION')
    private readonly db: Pool,
  ) {}

  async getProjectOverview(user: {
    id: number;
    organization_id: number;
    role_id: Role;
  }) {
    if (user.role_id === Role.SUPER_ADMIN) {
      const result = await this.db.query(`
        SELECT
          COUNT(*) AS "totalProjects",
          COUNT(*) FILTER (WHERE is_active = true) AS "activeProjects"
        FROM projects;
      `);
      return {
        totalProjects: Number(result.rows[0].totalProjects),
        activeProjects: Number(result.rows[0].activeProjects),
      };
    }

    const result = await this.db.query(
      `
      SELECT
        COUNT(*) AS "totalProjects",
        COUNT(*) FILTER (WHERE is_active = true) AS "activeProjects"
      FROM projects
      WHERE organization_id = $1;
    `,
      [user.organization_id],
    );

    return {
      totalProjects: Number(result.rows[0].totalProjects),
      activeProjects: Number(result.rows[0].activeProjects),
    };
  }

  async getTaskStatistics(user: {
    id: number;
    organization_id: number;
    role_id: Role;
  }) {
    if (user.role_id === Role.SUPER_ADMIN) {
      const result = await this.db.query(`
        SELECT
          COUNT(*) AS "totalTasks",
          COUNT(*) FILTER (WHERE status = 'to_do') AS "todo",
          COUNT(*) FILTER (WHERE status = 'in_progress') AS "inProgress",
          COUNT(*) FILTER (WHERE status = 'in_review') AS "inReview",
          COUNT(*) FILTER (WHERE status = 'testing') AS "testing",
          COUNT(*) FILTER (WHERE status = 'done') AS "done"
        FROM tasks;
      `);
      return {
        totalTasks: Number(result.rows[0].totalTasks),
        todo: Number(result.rows[0].todo),
        inProgress: Number(result.rows[0].inProgress),
        inReview: Number(result.rows[0].inReview),
        testing: Number(result.rows[0].testing),
        done: Number(result.rows[0].done),
      };
    }

    const result = await this.db.query(
      `
      SELECT
        COUNT(*) AS "totalTasks",
        COUNT(*) FILTER (WHERE t.status = 'to_do') AS "todo",
        COUNT(*) FILTER (WHERE t.status = 'in_progress') AS "inProgress",
        COUNT(*) FILTER (WHERE t.status = 'in_review') AS "inReview",
        COUNT(*) FILTER (WHERE t.status = 'testing') AS "testing",
        COUNT(*) FILTER (WHERE t.status = 'done') AS "done"
      FROM tasks t
      JOIN projects p ON p.id = t.project_id
      WHERE p.organization_id = $1;
    `,
      [user.organization_id],
    );

    return {
      totalTasks: Number(result.rows[0].totalTasks),
      todo: Number(result.rows[0].todo),
      inProgress: Number(result.rows[0].inProgress),
      inReview: Number(result.rows[0].inReview),
      testing: Number(result.rows[0].testing),
      done: Number(result.rows[0].done),
    };
  }

  async getAssignedTasks(userId: number) {
    const result = await this.db.query(
      `
      SELECT
        COUNT(*) AS "myTasks",
        COUNT(*) FILTER (WHERE status != 'done') AS "pending",
        COUNT(*) FILTER (WHERE status = 'done') AS "completed"
      FROM tasks
      WHERE assignee_id = $1;
    `,
      [userId],
    );

    return {
      myTasks: Number(result.rows[0].myTasks),
      pending: Number(result.rows[0].pending),
      completed: Number(result.rows[0].completed),
    };
  }

  async getSprintOverview(user: {
    id: number;
    organization_id: number;
    role_id: Role;
  }) {
    if (user.role_id === Role.SUPER_ADMIN) {
      const result = await this.db.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'planned') AS "planned",
          COUNT(*) FILTER (WHERE status = 'active') AS "active",
          COUNT(*) FILTER (WHERE status = 'completed') AS "completed"
        FROM sprints;
      `);
      return {
        planned: Number(result.rows[0].planned),
        active: Number(result.rows[0].active),
        completed: Number(result.rows[0].completed),
      };
    }

    const result = await this.db.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE s.status = 'planned') AS "planned",
        COUNT(*) FILTER (WHERE s.status = 'active') AS "active",
        COUNT(*) FILTER (WHERE s.status = 'completed') AS "completed"
      FROM sprints s
      JOIN projects p ON p.id = s.project_id
      WHERE p.organization_id = $1;
    `,
      [user.organization_id],
    );

    return {
      planned: Number(result.rows[0].planned),
      active: Number(result.rows[0].active),
      completed: Number(result.rows[0].completed),
    };
  }

  async getDashboard(user: {
    id: number;
    organization_id: number;
    role_id: Role;
  }): Promise<DashboardData> {
    const [projectOverview, taskStatistics, assignedTasks, sprintOverview] =
      await Promise.all([
        this.getProjectOverview(user),
        this.getTaskStatistics(user),
        this.getAssignedTasks(user.id),
        this.getSprintOverview(user),
      ]);

    return {
      projectOverview,
      taskStatistics,
      assignedTasks,
      sprintOverview,
    };
  }
}
