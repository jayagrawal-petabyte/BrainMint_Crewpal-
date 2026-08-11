import { Injectable, NotImplementedException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { Role } from '../common/constants/roles.constant';

@Injectable()
export class SearchService {
  constructor(private readonly projectsService: ProjectsService) {}

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
    filters: SearchTaskFilters,
    user: SearchUser,
  ) {
    return this.tasksService.searchTasks({
      ...filters,
      organizationId: user.organization_id,
    });
  }
}
