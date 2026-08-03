import { create } from 'zustand';
import type { Project, ProjectFilter, ProjectSortKey } from '../../types/project';

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'School Mobile App',
    owner: 'Jay Agarwal',
    status: 'on_track',
    isStarred: true,
    createdAt: '2026-07-12T09:00:00Z',
    description: 'Mobile application development for School portals.',
    category: 'Development',
    techStack: 'React Native',
    progress: 75,
  },
  {
    id: 'proj-002',
    name: 'Management Project',
    owner: 'Jay Agarwal',
    status: 'delayed',
    isStarred: false,
    createdAt: '2026-07-10T10:00:00Z',
    description: 'Internal task and workspace management portal.',
    category: 'Management',
    techStack: 'React + Node',
    progress: 45,
  },
  {
    id: 'proj-003',
    name: 'School ERP Project',
    owner: 'Jay Agarwal',
    status: 'on_track',
    isStarred: false,
    createdAt: '2026-07-15T11:00:00Z',
    description: 'Enterprise Resource Planning system for schools.',
    category: 'Development',
    techStack: 'Next.js + PostgreSQL',
    progress: 60,
  },
  {
    id: 'proj-004',
    name: 'Intern Management Project',
    owner: 'Jay Agarwal',
    status: 'completed',
    isStarred: true,
    createdAt: '2026-07-08T08:00:00Z',
    description: 'Zustand-powered onboarding & task manager for interns.',
    category: 'HR / Management',
    techStack: 'React + Zustand',
    progress: 100,
  },
];

interface ProjectState {
  projects: Project[];
  filter: ProjectFilter;

  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'isStarred'>) => void;
  toggleStarProject: (id: string) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;

  // Filters & Sorting
  setSearch: (search: string) => void;
  setStatusFilter: (status: ProjectFilter['status']) => void;
  setStarredOnly: (starredOnly: boolean) => void;
  setSortBy: (sortBy: ProjectSortKey) => void;
  resetFilter: () => void;

  // Selector
  getFilteredProjects: () => Project[];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: SEED_PROJECTS,
  filter: {
    search: '',
    status: 'all',
    starredOnly: false,
    sortBy: 'name_asc',
  },

  addProject: (projData) => {
    const newProj: Project = {
      ...projData,
      id: `proj-${Date.now()}`,
      isStarred: false,
      createdAt: new Date().toISOString(),
      techStack: projData.techStack || 'React + Node',
      progress: projData.progress || 0,
    };
    set((state) => ({ projects: [newProj, ...state.projects] }));
  },

  toggleStarProject: (id) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, isStarred: !p.isStarred } : p
      ),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  setSearch: (search) =>
    set((state) => ({ filter: { ...state.filter, search } })),

  setStatusFilter: (status) =>
    set((state) => ({ filter: { ...state.filter, status } })),

  setStarredOnly: (starredOnly) =>
    set((state) => ({ filter: { ...state.filter, starredOnly } })),

  setSortBy: (sortBy) =>
    set((state) => ({ filter: { ...state.filter, sortBy } })),

  resetFilter: () =>
    set({
      filter: {
        search: '',
        status: 'all',
        starredOnly: false,
        sortBy: 'name_asc',
      },
    }),

  getFilteredProjects: () => {
    const { projects, filter } = get();
    
    // Filter
    let result = projects.filter((proj) => {
      const matchesSearch =
        filter.search === '' ||
        proj.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        proj.owner.toLowerCase().includes(filter.search.toLowerCase()) ||
        (proj.description && proj.description.toLowerCase().includes(filter.search.toLowerCase()));

      const matchesStatus = filter.status === 'all' || proj.status === filter.status;
      const matchesStarred = !filter.starredOnly || proj.isStarred;

      return matchesSearch && matchesStatus && matchesStarred;
    });

    // Sort
    result.sort((a, b) => {
      if (filter.sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      } else if (filter.sortBy === 'name_desc') {
        return b.name.localeCompare(a.name);
      } else if (filter.sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (filter.sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  },
}));
