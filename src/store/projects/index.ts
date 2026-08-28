import { create } from 'zustand';
import type { Project, ProjectFilter, ProjectSortKey } from '../../types/project';
import { projectService } from '../../services/projectService';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  filter: ProjectFilter;

  // Actions
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'isStarred'>) => Promise<void>;
  toggleStarProject: (id: string) => void;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => Promise<void>;
  updateProjectMembers: (projectId: string, memberIds: string[]) => void;

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
  projects: [],
  isLoading: false,
  error: null,
  filter: {
    search: '',
    status: 'all',
    starredOnly: false,
    sortBy: 'name_asc',
  },

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectService.getProjects();
      set({ projects: Array.isArray(projects) ? projects : [], isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to retrieve projects from backend API.',
        isLoading: false,
      });
    }
  },

  addProject: async (projData) => {
    set({ isLoading: true, error: null });
    try {
      const createdProject = await projectService.createProject(projData);
      set((state) => ({
        projects: [createdProject, ...state.projects],
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || 'Failed to create project on backend API.',
        isLoading: false,
      });
      throw err;
    }
  },

  toggleStarProject: (id) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, isStarred: !p.isStarred } : p
      ),
    }));
  },

  deleteProject: async (id) => {
    try {
      await projectService.deleteProject(id);
      set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete project.' });
      throw err;
    }
  },

  updateProject: async (id, updates) => {
    try {
      const updated = await projectService.updateProject(id, updates);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updated } : p
        ),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to update project.' });
      throw err;
    }
  },

  updateProjectMembers: (projectId, memberIds) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, memberIds } : project
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
    const result = projects.filter((proj) => {
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
