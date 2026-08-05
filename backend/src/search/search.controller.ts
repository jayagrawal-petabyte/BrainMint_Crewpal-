import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('projects')
  async searchProjects(
    @Query('search') search?: string,
    @Query('organizationId') organizationId?: number,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.searchService.searchProjects({
      search,
      organizationId,
      isActive,
    });
  }

  @Get('tasks')
  async searchTasks(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('projectId') projectId?: number,
    @Query('assigneeId') assigneeId?: number,
    @Query('isClosed') isClosed?: boolean,
  ) {
    return this.searchService.searchTasks({
      search,
      status,
      priority,
      projectId,
      assigneeId,
      isClosed,
    });
  }
}
