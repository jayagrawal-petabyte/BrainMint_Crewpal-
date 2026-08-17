import type { Task } from '../types/task';
import type { AssignedTask, DeadlineItem, DashboardUser } from '../types/dashboard';
import { daysUntil, isOverdue, normalizeText } from '../utils/format';

class TaskService {
  async getAssignedTasks(
    tasks: Task[],
    user: DashboardUser | null
  ): Promise<AssignedTask[]> {
    if (!user) {
      return [];
    }

    const normalizedName = normalizeText(user.name);
    const normalizedEmail = normalizeText(user.email);

    const matches = tasks.filter((task) =>
      task.assignees.some(
        (assignee) =>
          assignee.id === user.id ||
          normalizeText(assignee.name) === normalizedName ||
          normalizeText(assignee.name) === normalizedEmail
      )
    );

    return matches
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .map((task) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        projectName: task.techTag,
      }));
  }

  async getUpcomingDeadlines(
    tasks: Task[],
    limit = 5
  ): Promise<DeadlineItem[]> {
    return tasks
      .filter((task) => task.status !== 'completed')
      .slice()
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, limit)
      .map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        projectName: task.techTag,
        daysLeft: daysUntil(task.dueDate),
        overdue: isOverdue(task.dueDate),
      }));
  }
}

export const taskService = new TaskService();
