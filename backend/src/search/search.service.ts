import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SearchService {
  constructor(
    @Inject('PG_CONNECTION')
    private readonly pool: Pool,
  ) {}

  async searchProjects(search?: string) {
    let query = `
      SELECT *
      FROM projects
      WHERE is_active = TRUE
    `;

    const values = [];

    if (search) {
      query += `
        AND (
          name ILIKE $1
          OR description ILIKE $1
        )
      `;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, values);

    return result.rows;
  }

  async searchTasks(filters: any) {
    let query = `
      SELECT *
      FROM tasks
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    if (filters.search) {
      query += `
        AND (
          title ILIKE $${index}
          OR description ILIKE $${index}
        )
      `;
      values.push(`%${filters.search}%`);
      index++;
    }

    if (filters.status) {
      query += ` AND status = $${index}`;
      values.push(filters.status);
      index++;
    }

    if (filters.priority) {
      query += ` AND priority = $${index}`;
      values.push(filters.priority);
      index++;
    }

    if (filters.projectId) {
      query += ` AND project_id = $${index}`;
      values.push(filters.projectId);
      index++;
    }

    if (filters.assigneeId) {
      query += ` AND assignee_id = $${index}`;
      values.push(filters.assigneeId);
      index++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, values);

    return result.rows;
  }
}