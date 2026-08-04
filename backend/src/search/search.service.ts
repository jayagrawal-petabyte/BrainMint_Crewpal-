import {
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly projectsService: ProjectsService,
    // private readonly tasksService: TasksService,
  ) {}

  async searchProjects(filters: {
    search?: string;
    organizationId?: number;
    isActive?: boolean;
  }) {
    return this.projectsService.searchProjects(filters);
  }

  async searchTasks(filters: {
    search?: string;
    status?: string;
    priority?: string;
    projectId?: number;
    assigneeId?: number;
    isClosed?: boolean;
  }) {
    /**
     * Uncomment after TasksService is implemented
     *
     * return this.tasksService.searchTasks(filters);
     */

    throw new NotImplementedException(
      'Task search is not implemented yet.',
    );
  }
}