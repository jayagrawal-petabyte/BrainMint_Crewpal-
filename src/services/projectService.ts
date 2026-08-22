import { api } from './apiClient';
import type { Project } from '../types/project';
import type { ProjectProgress } from '../types/dashboard';

const DEFAULT_PROGRESS: Record<
  string,
  { frontend: number; backend: number; cyberChecks: number }
> = {
  'School Mobile App': { frontend: 80, backend: 60, cyberChecks: 30 },
  'Management Project': { frontend: 80, backend: 60, cyberChecks: 30 },
  'School ERP Project': { frontend: 80, backend: 60, cyberChecks: 30 },
  'Intern Management Project': { frontend: 80, backend: 60, cyberChecks: 30 },
};

class ProjectService {
  async getProjects(): Promise<Project[]> {
    return api.get<Project[]>('/projects');
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'isStarred'>): Promise<Project> {
    return api.post<Project>('/projects', project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return api.patch<Project>(`/projects/${id}`, updates);
  }

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  }

  async getProjectProgress(projects: Project[]): Promise<ProjectProgress[]> {
    return projects.map((project) => {
      if (project.status === 'completed') {
        return {
          id: project.id,
          name: project.name,
          frontend: 100,
          backend: 100,
          cyberChecks: 100,
        };
      }

      const progress = DEFAULT_PROGRESS[project.name] ?? {
        frontend: 0,
        backend: 0,
        cyberChecks: 0,
      };

      return {
        id: project.id,
        name: project.name,
        frontend: progress.frontend,
        backend: progress.backend,
        cyberChecks: progress.cyberChecks,
      };
    });
  }
}

export const projectService = new ProjectService();
