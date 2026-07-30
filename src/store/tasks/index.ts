import { create } from 'zustand';
import type { Task, TaskStatus, TaskPriority, TaskFilter, Assignee } from '../../types/task';

// ─── Mock Team Members ───────────────────────────────────────────────────────

export const MOCK_TEAM_MEMBERS: Assignee[] = [
  { id: 'u1', name: 'Jay Agrawal', initials: 'JA', avatarColor: 'bg-rose-300' },
  { id: 'u2', name: 'Harsh Gupta', initials: 'HG', avatarColor: 'bg-olive-300' },
  { id: 'u3', name: 'Ananya Sharma', initials: 'AS', avatarColor: 'bg-cream-300' },
  { id: 'u4', name: 'Rohan Verma', initials: 'RV', avatarColor: 'bg-rose-200' },
  { id: 'u5', name: 'Priya Nair', initials: 'PN', avatarColor: 'bg-olive-200' },
];

// ─── Sort Options ────────────────────────────────────────────────────────────

export type SortBy = 'name' | 'dueDate' | 'priority' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

const PRIORITY_RANK: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };

// ─── Initial Seed Data ────────────────────────────────────────────────────────

const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design Task Management Architecture',
    description: 'Structure components, store, and state flow for CREWPAL Task module.',
    techTag: 'React + Node',
    status: 'on_track',
    priority: 'high',
    dueDate: '2026-08-05',
    assignees: [MOCK_TEAM_MEMBERS[0], MOCK_TEAM_MEMBERS[1]],
    comments: [],
    subtasks: [],
    createdAt: '2026-07-15T10:00:00Z',
    updatedAt: '2026-07-15T10:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Implement Reusable Task Cards',
    description: 'Extract TaskCard component with hover effects, priority dot, and actions.',
    techTag: 'React + Tailwind',
    status: 'on_track',
    priority: 'medium',
    dueDate: '2026-08-08',
    assignees: [MOCK_TEAM_MEMBERS[1], MOCK_TEAM_MEMBERS[2]],
    comments: [],
    subtasks: [],
    createdAt: '2026-07-16T11:00:00Z',
    updatedAt: '2026-07-16T11:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Build Filter & Search System',
    description: 'Multi-criteria filter dropdown for status and priority with real-time search.',
    techTag: 'Zustand + React',
    status: 'delayed',
    priority: 'high',
    dueDate: '2026-07-25',
    assignees: [MOCK_TEAM_MEMBERS[0], MOCK_TEAM_MEMBERS[3]],
    comments: [
      { id: 'c1', authorId: 'u1', authorName: 'Jay Agrawal', authorInitials: 'JA', text: 'We need to finalize filter combinations.', createdAt: '2026-07-18T14:00:00Z' },
    ],
    subtasks: [
      { id: 'st1', title: 'Search by name', completed: true },
      { id: 'st2', title: 'Filter by status', completed: true },
      { id: 'st3', title: 'Filter by priority', completed: false },
    ],
    createdAt: '2026-07-14T09:00:00Z',
    updatedAt: '2026-07-18T14:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Create Task & Edit Task Modals',
    description: 'Interactive popup forms with assignee selection and full validation.',
    techTag: 'React Modal',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-07-20',
    assignees: [MOCK_TEAM_MEMBERS[2], MOCK_TEAM_MEMBERS[4]],
    comments: [
      { id: 'c2', authorId: 'u3', authorName: 'Ananya Sharma', authorInitials: 'AS', text: 'Both modals working great, merged!', createdAt: '2026-07-14T17:00:00Z' },
    ],
    subtasks: [
      { id: 'st4', title: 'Create modal', completed: true },
      { id: 'st5', title: 'Edit modal', completed: true },
      { id: 'st6', title: 'Form validation', completed: true },
    ],
    createdAt: '2026-07-10T09:00:00Z',
    updatedAt: '2026-07-14T17:00:00Z',
  },
  {
    id: 'task-5',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for lint, build, and deploy to staging.',
    techTag: 'Node.js',
    status: 'on_track',
    priority: 'low',
    dueDate: '2026-08-12',
    assignees: [MOCK_TEAM_MEMBERS[3]],
    comments: [],
    subtasks: [],
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'task-6',
    title: 'Responsive Layout & Mobile View',
    description: 'Ensure all pages work on 375px through 1440px screens.',
    techTag: 'React + Tailwind',
    status: 'delayed',
    priority: 'medium',
    dueDate: '2026-07-28',
    assignees: [MOCK_TEAM_MEMBERS[1], MOCK_TEAM_MEMBERS[4]],
    comments: [],
    subtasks: [
      { id: 'st7', title: 'Mobile task list', completed: false },
      { id: 'st8', title: 'Tablet layout', completed: false },
    ],
    createdAt: '2026-07-18T09:00:00Z',
    updatedAt: '2026-07-22T11:00:00Z',
  },
  {
    id: 'task-7',
    title: 'Dashboard Stats & Charts',
    description: 'Build overview cards showing task metrics and priority distribution.',
    techTag: 'React',
    status: 'on_track',
    priority: 'high',
    dueDate: '2026-08-02',
    assignees: [MOCK_TEAM_MEMBERS[0], MOCK_TEAM_MEMBERS[2]],
    comments: [],
    subtasks: [],
    createdAt: '2026-07-22T09:00:00Z',
    updatedAt: '2026-07-22T09:00:00Z',
  },
];

// ─── Store Interface ─────────────────────────────────────────────────────────

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  sortBy: SortBy;
  sortOrder: SortOrder;
  viewMode: 'list' | 'kanban' | 'calendar';

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'subtasks'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  assignTask: (id: string, assignees: Assignee[]) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  updatePriority: (id: string, priority: TaskPriority) => void;

  // Comments
  addComment: (taskId: string, authorId: string, authorName: string, authorInitials: string, text: string) => void;

  // Subtasks
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Filters
  setSearch: (search: string) => void;
  setStatusFilter: (status: TaskFilter['status']) => void;
  setPriorityFilter: (priority: TaskFilter['priority']) => void;
  resetFilter: () => void;

  // Sort
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;

  // View
  setViewMode: (mode: 'list' | 'kanban' | 'calendar') => void;

  // Selectors
  getFilteredTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: SEED_TASKS,
  filter: {
    search: '',
    status: 'all',
    priority: 'all',
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  viewMode: 'list',

  addTask: (newTaskData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      comments: [],
      subtasks: [],
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  updateTask: (id, updates) => {
    const now = new Date().toISOString();
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: now } : task
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  assignTask: (id, assignees) => {
    get().updateTask(id, { assignees });
  },

  updateStatus: (id, status) => {
    get().updateTask(id, { status });
  },

  updatePriority: (id, priority) => {
    get().updateTask(id, { priority });
  },

  // ─── Comments ──────────────────────────────────────────────────────────────

  addComment: (taskId, authorId, authorName, authorInitials, text) => {
    const comment = {
      id: `comment-${Date.now()}`,
      authorId,
      authorName,
      authorInitials,
      text,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, comments: [...task.comments, comment], updatedAt: new Date().toISOString() } : task
      ),
    }));
  },

  // ─── Subtasks ──────────────────────────────────────────────────────────────

  addSubtask: (taskId, title) => {
    const subtask = { id: `subtask-${Date.now()}`, title, completed: false };
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, subtasks: [...task.subtasks, subtask], updatedAt: new Date().toISOString() } : task
      ),
    }));
  },

  toggleSubtask: (taskId, subtaskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
              updatedAt: new Date().toISOString(),
            }
          : task
      ),
    }));
  },

  deleteSubtask: (taskId, subtaskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: task.subtasks.filter((st) => st.id !== subtaskId), updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },

  // ─── Filters ───────────────────────────────────────────────────────────────

  setSearch: (search) => {
    set((state) => ({ filter: { ...state.filter, search } }));
  },

  setStatusFilter: (status) => {
    set((state) => ({ filter: { ...state.filter, status } }));
  },

  setPriorityFilter: (priority) => {
    set((state) => ({ filter: { ...state.filter, priority } }));
  },

  resetFilter: () => {
    set(() => ({
      filter: { search: '', status: 'all', priority: 'all' },
    }));
  },

  // ─── Sort ──────────────────────────────────────────────────────────────────

  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  // ─── View Mode ─────────────────────────────────────────────────────────────

  setViewMode: (viewMode) => set({ viewMode }),

  // ─── Selectors ─────────────────────────────────────────────────────────────

  getFilteredTasks: () => {
    const { tasks, filter, sortBy, sortOrder } = get();

    let filtered = tasks.filter((task) => {
      const matchesSearch =
        filter.search.trim() === '' ||
        task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.techTag.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filter.search.toLowerCase());

      const matchesStatus = filter.status === 'all' || task.status === filter.status;
      const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          cmp = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
          break;
        case 'createdAt':
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return filtered;
  },

  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id);
  },
}));
