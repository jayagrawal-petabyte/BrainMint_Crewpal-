import { Injectable, NotImplementedException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { Role } from '../common/constants/roles.constant';

@Injectable()
export class SearchService {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  async searchProjects(
    filters: {
      search?: string;
      isActive?: boolean;
    },
    user: { id: number; organization_id: number; role_id: number },
  ) {
    const orgId = user.role_id === Role.SUPER_ADMIN ? undefined : user.organization_id;
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
      projectId?: number;
      assigneeId?: number;
      isClosed?: boolean;
    },
    user: { id: number; organization_id: number; role_id: number },
  ) {
    throw new NotImplementedException('Task search is not implemented yet.');
  }
}
