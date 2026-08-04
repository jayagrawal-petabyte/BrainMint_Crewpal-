export const TASK_STATUS = {
  TODO: 'to_do',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  TESTING: 'testing',
  DONE: 'done',
} as const;

export const SPRINT_STATUS = {
  PLANNED: 'planned',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;