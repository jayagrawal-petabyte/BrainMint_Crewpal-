export interface ProjectReport {
  project: {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
  };

  summary: {
    totalMembers: number;
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