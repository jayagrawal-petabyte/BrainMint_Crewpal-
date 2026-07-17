import { create } from 'zustand';
import type { Task, TaskFilter, TaskStatus, TaskPriority, Assignee } from '../../types/task';

// ─── Mock seed data ─────────────────────────────────────────────────────────

const MOCK_ASSIGNEES: Assignee[] = [
  { id: 'u1', name: 'Shanti Biswas',  initials: 'SB', avatarColor: 'bg-rose-300' },
  { id: 'u2', name: 'Raj Kumar',      initials: 'RK', avatarColor: 'bg-olive-300' },
  { id: 'u3', name: 'Priya Nair',     initials: 'PN', avatarColor: 'bg-teal-300' },
  { id: 'u4', name: 'Aryan Mehta',    initials: 'AM', avatarColor: 'bg-forest-400' },
];

const SEED_TASKS: Task[] = [
  {
    id: 'task-001',
    title: 'School ERP Project',
    description: 'Build the frontend for the school ERP management system using React and Node.',
    techTag: 'React + Node',
    status: 'on_track',
    priority: 'high',
    dueDate: '2026-07-25',
    assignees: [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[1], MOCK_ASSIGNEES[2], MOCK_ASSIGNEES[3]],
    createdAt: '2026-07-14T09:00:00Z',
    updatedAt: '2026-07-16T10:00:00Z',
  },
  {
    id: 'task-002',
    title: 'School Mobile App',
    description: 'Develop the mobile application for student and teacher portals using React Native.',
    techTag: 'React Native',
    status: 'on_track',
    priority: 'medium',
    dueDate: '2026-07-28',
    assignees: [MOCK_ASSIGNEES[1], MOCK_ASSIGNEES[2], MOCK_ASSIGNEES[3], MOCK_ASSIGNEES[0]],
    createdAt: '2026-07-14T09:30:00Z',
    updatedAt: '2026-07-16T11:00:00Z',
  },
  {
    id: 'task-003',
    title: 'Management Project',
    description: 'Create the management dashboard module integrating backend APIs with the React frontend.',
    techTag: 'React + Node',
    status: 'delayed',
    priority: 'high',
    dueDate: '2026-07-20',
    assignees: [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[2], MOCK_ASSIGNEES[3], MOCK_ASSIGNEES[1]],
    createdAt: '2026-07-12T08:00:00Z',
    updatedAt: '2026-07-17T09:00:00Z',
  },
  {
    id: 'task-004',
    title: 'Intern Management Project',
    description: 'Complete the intern management portal including task assignment and progress tracking.',
    techTag: 'React + Node',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-07-15',
    assignees: [MOCK_ASSIGNEES[3], MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[1], MOCK_ASSIGNEES[2]],
    createdAt: '2026-07-08T08:00:00Z',
    updatedAt: '2026-07-15T18:00:00Z',
  },
  {
    id: 'task-005',
    title: 'Notification Panel',
    description: 'Implement the real-time notification panel in the admin portal.',
    techTag: 'React',
    status: 'on_track',
    priority: 'medium',
    dueDate: '2026-07-22',
    assignees: [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[1]],
    createdAt: '2026-07-16T10:00:00Z',
    updatedAt: '2026-07-17T10:00:00Z',
  },
  {
    id: 'task-006',
    title: 'Exam Portal Integration',
    description: 'Integrate the exam portal frontend with the backend API and ensure grade submission flow works.',
    techTag: 'React + Node',
    status: 'delayed',
    priority: 'high',
    dueDate: '2026-07-18',
    assignees: [MOCK_ASSIGNEES[2], MOCK_ASSIGNEES[3]],
    createdAt: '2026-07-13T09:00:00Z',
    updatedAt: '2026-07-17T11:00:00Z',
  },
  {
    id: 'task-007',
    title: 'Admin Role Review',
    description: 'Review and finalise the role-based access control implementation in the admin portal.',
    techTag: 'React',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-07-14',
    assignees: [MOCK_ASSIGNEES[1], MOCK_ASSIGNEES[0]],
    createdAt: '2026-07-10T09:00:00Z',
    updatedAt: '2026-07-14T17:00:00Z',
  },
];

// ─── Store types ─────────────────────────────────────────────────────────────

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

  // Derived / selectors
  getFilteredTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: SEED_TASKS,
  filter: {
    search: '',
    status: 'all',
    priority: 'all',
  },

  // ── Task CRUD ──────────────────────────────────────────────────────────────

  addTask: (taskData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  assignTask: (id, assignees) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, assignees, updatedAt: new Date().toISOString() } : t
      ),
    }));
  },

  updateStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    }));
  },

  updatePriority: (id, priority) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, priority, updatedAt: new Date().toISOString() } : t
      ),
    }));
  },

  // ── Filters ────────────────────────────────────────────────────────────────

  setSearch: (search) =>
    set((state) => ({ filter: { ...state.filter, search } })),

  setStatusFilter: (status) =>
    set((state) => ({ filter: { ...state.filter, status } })),

  setPriorityFilter: (priority) =>
    set((state) => ({ filter: { ...state.filter, priority } })),

  resetFilter: () =>
    set({ filter: { search: '', status: 'all', priority: 'all' } }),

  // ── Selectors ──────────────────────────────────────────────────────────────

  getFilteredTasks: () => {
    const { tasks, filter } = get();
    return tasks.filter((task) => {
      const matchesSearch =
        filter.search === '' ||
        task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.techTag.toLowerCase().includes(filter.search.toLowerCase());

      const matchesStatus =
        filter.status === 'all' || task.status === filter.status;

      const matchesPriority =
        filter.priority === 'all' || task.priority === filter.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  },

  getTaskById: (id) => get().tasks.find((t) => t.id === id),
}));

// ─── Convenience exports ──────────────────────────────────────────────────────

export const MOCK_TEAM_MEMBERS = MOCK_ASSIGNEES;
