import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('projects')
  async searchProjects(
    @Query('search') search: string | undefined,
    @Query('isActive') isActive: boolean | undefined,
    @Req() req: any,
  ) {
    return this.searchService.searchProjects(
      { search, isActive },
      req.user,
    );
  }

  @Get('tasks')
  async searchTasks(
    @Query('search') search: string | undefined,
    @Query('status') status: string | undefined,
    @Query('priority') priority: string | undefined,
    @Query('projectId') projectId: number | undefined,
    @Query('assigneeId') assigneeId: number | undefined,
    @Query('isClosed') isClosed: boolean | undefined,
    @Req() req: any,
  ) {
    return this.searchService.searchTasks(
      { search, status, priority, projectId, assigneeId, isClosed },
      req.user,
    );
  }
}
