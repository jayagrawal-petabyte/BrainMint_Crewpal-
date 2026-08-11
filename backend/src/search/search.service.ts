import { Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { Role } from '../common/constants/roles.constant';

@Injectable()
export class SearchService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  async searchProjects(
    filters: {
      search?: string;
      isActive?: boolean;
    },
    user: {
      id: number;
      organization_id: number;
      role_id: Role;
    },
  ) {
    const orgId =
      user.role_id === Role.SUPER_ADMIN ? undefined : user.organization_id;
    return this.projectsService.searchProjects({
      ...filters,
      organizationId: orgId,
    });
  }

  async searchTasks(
    filters: {
      search?: string;
      status?: string;
      priority?: string;
      assigneeId?: number;
      projectId?: number;
    },
    user: {
      id: number;
      organization_id: number;
      role_id: Role;
    },
  ) {
    return this.tasksService.searchTasks(user, filters);
  }
}
