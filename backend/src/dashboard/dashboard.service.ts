import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { DashboardData } from './interfaces/dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('PG_CONNECTION')
    private readonly db: Pool,
  ) {}

  async getProjectOverview() {
      const query = `
    SELECT
      COUNT(*) AS "totalProjects",
      COUNT(*) FILTER (WHERE is_active = true) AS "activeProjects"
    FROM projects;
  `;

  const result = await this.db.query(query);

  return {
    totalProjects: Number(result.rows[0].totalProjects),
    activeProjects: Number(result.rows[0].activeProjects),
  };
  }

  async getTaskStatistics() {
      const query = `
    SELECT
      COUNT(*) AS "totalTasks",
      COUNT(*) FILTER (WHERE status = 'to_do') AS "todo",
      COUNT(*) FILTER (WHERE status = 'in_progress') AS "inProgress",
      COUNT(*) FILTER (WHERE status = 'in_review') AS "inReview",
      COUNT(*) FILTER (WHERE status = 'testing') AS "testing",
      COUNT(*) FILTER (WHERE status = 'done') AS "done"
    FROM tasks;
  `;

  const result = await this.db.query(query);

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
   const query = `
    SELECT
      COUNT(*) AS "myTasks",
      COUNT(*) FILTER (WHERE status != 'done') AS "pending",
      COUNT(*) FILTER (WHERE status = 'done') AS "completed"
    FROM tasks
    WHERE assignee_id = $1;
  `;

  const result = await this.db.query(query, [userId]);

  return {
    myTasks: Number(result.rows[0].myTasks),
    pending: Number(result.rows[0].pending),
    completed: Number(result.rows[0].completed),
  };
  }

  async getSprintOverview() {
     const query = `
    SELECT
      COUNT(*) FILTER (WHERE status = 'planned') AS "planned",
      COUNT(*) FILTER (WHERE status = 'active') AS "active",
      COUNT(*) FILTER (WHERE status = 'completed') AS "completed"
    FROM sprints;
  `;

  const result = await this.db.query(query);

  return {
    planned: Number(result.rows[0].planned),
    active: Number(result.rows[0].active),
    completed: Number(result.rows[0].completed),
  };
  }

  async getDashboard(userId: number): Promise<DashboardData> {
     const [
    projectOverview,
    taskStatistics,
    assignedTasks,
    sprintOverview,
  ] = await Promise.all([
    this.getProjectOverview(),
    this.getTaskStatistics(),
    this.getAssignedTasks(userId),
    this.getSprintOverview(),
  ]);

  return {
    projectOverview,
    taskStatistics,
    assignedTasks,
    sprintOverview,
  };
  }
}