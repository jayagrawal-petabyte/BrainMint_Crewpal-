export interface SprintReport {
  sprint: {
    id: number;
    project_id: number;
    name: string;
    start_date: Date | null;
    end_date: Date | null;
    status: string;
  };

  summary: {
    totalTasks: number;
    completedTasks: number;
    remainingTasks: number;
    completionPercentage: number;
  };

  taskStatus: {
    totalTasks: number;
    todo: number;
    inProgress: number;
    inReview: number;
    testing: number;
    done: number;
  };
}