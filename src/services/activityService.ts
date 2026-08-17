import type { ActivityEvent } from '../types/activity';
import type { Task } from '../types/task';
import type { DashboardActivity } from '../types/dashboard';

export interface ActivityInput {
  events: ActivityEvent[];
  tasks: Task[];
}

class ActivityService {
  async getRecentActivity(
    input: ActivityInput,
    limit = 6
  ): Promise<DashboardActivity[]> {
    const taskTitles = new Map<string, string>(
      input.tasks.map((task) => [task.id, task.title])
    );

    return [...input.events]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit)
      .map((event) => ({
        id: event.id,
        taskId: event.taskId,
        type: event.type,
        actorName: event.actorName,
        actorInitials: event.actorInitials,
        message: event.message,
        timestamp: event.timestamp,
        taskTitle: taskTitles.get(event.taskId) ?? 'A task',
      }));
  }
}

export const activityService = new ActivityService();
