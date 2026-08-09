import { Injectable } from '@nestjs/common';

import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';

interface SearchProjectFilters {
  search?: string;
  isActive?: boolean;
}

interface SearchTaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  projectId?: number;
  assigneeId?: number;
  isClosed?: boolean;
}

interface SearchUser {
  id: number;
  organization_id: number;
  role_id: number;
}

@Injectable()
export class SearchService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  async searchProjects(
    filters: SearchProjectFilters,
    user: SearchUser,
  ) {
    return this.projectsService.searchProjects({
      search: filters.search,
      organizationId: user.organization_id,
      isActive: filters.isActive,
    });
  }

  async searchTasks(
    filters: SearchTaskFilters,
    user: SearchUser,
  ) {
    return this.tasksService.searchTasks({
      ...filters,
      organizationId: user.organization_id,
    });
  }
}