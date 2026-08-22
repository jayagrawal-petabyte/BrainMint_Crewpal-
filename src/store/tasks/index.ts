import { create } from 'zustand';
import type { Task, TaskStatus, TaskPriority, TaskFilter, Assignee } from '../../types/task';
import { taskService } from '../../services/taskService';

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

// ─── Store Interface ─────────────────────────────────────────────────────────

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: TaskFilter;
  sortBy: SortBy;
  sortOrder: SortOrder;
  viewMode: 'list' | 'kanban' | 'calendar';

  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'subtasks'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  assignTask: (id: string, assignees: Assignee[]) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  updatePriority: (id: string, priority: TaskPriority) => void;
  updateProjectTasks: (projectId: string, taskIds: string[]) => void;

  // Comments
  addComment: (taskId: string, authorId: string, authorName: string, authorInitials: string, text: string) => void;

  // Subtasks
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  addAttachment: (taskId: string, name: string, type: string, size: string, url: string) => void;
  deleteAttachment: (taskId: string, attachmentId: string) => void;

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
  tasks: [],
  isLoading: false,
  error: null,
  filter: {
    search: '',
    status: 'all',
    priority: 'all',
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  viewMode: 'list',

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getTasks();
      set({ tasks: Array.isArray(tasks) ? tasks : [], isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to retrieve tasks from backend API.',
        isLoading: false,
      });
    }
  },

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

  updateProjectTasks: (projectId, taskIds) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (taskIds.includes(task.id)) {
          return { ...task, projectId };
        }

        if (task.projectId === projectId) {
          return { ...task, projectId: undefined };
        }

        return task;
      }),
    }));
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

  addAttachment: (taskId, name, type, size, url) => {
    const attachment = {
      id: `att-${Date.now()}`,
      name,
      type,
      size,
      url,
      uploadedAt: new Date().toISOString(),
    };
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, attachments: [...(task.attachments || []), attachment], updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },

  deleteAttachment: (taskId, attachmentId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, attachments: (task.attachments || []).filter((a) => a.id !== attachmentId), updatedAt: new Date().toISOString() }
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
