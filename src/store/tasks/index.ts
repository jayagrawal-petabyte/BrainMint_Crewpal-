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
    createdAt: '2026-07-10T09:00:00Z',
    updatedAt: '2026-07-14T17:00:00Z',
  },
];

// ─── Store Interface ─────────────────────────────────────────────────────────

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  assignTask: (id: string, assignees: Assignee[]) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  updatePriority: (id: string, priority: TaskPriority) => void;

  // Filters
  setSearch: (search: string) => void;
  setStatusFilter: (status: TaskFilter['status']) => void;
  setPriorityFilter: (priority: TaskFilter['priority']) => void;
  resetFilter: () => void;

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

  addTask: (newTaskData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
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

  getFilteredTasks: () => {
    const { tasks, filter } = get();
    return tasks.filter((task) => {
      // Search text match
      const matchesSearch =
        filter.search.trim() === '' ||
        task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.techTag.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filter.search.toLowerCase());

      // Status match
      const matchesStatus = filter.status === 'all' || task.status === filter.status;

      // Priority match
      const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  },

  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id);
  },
}));
