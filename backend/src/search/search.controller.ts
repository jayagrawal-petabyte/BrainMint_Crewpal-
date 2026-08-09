import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @Get('projects')
  async searchProjects(
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Req() req?: any,
  ) {
    return this.searchService.searchProjects(
      {
        search,
        isActive:
          isActive !== undefined
            ? isActive === 'true'
            : undefined,
      },
      req.user,
    );
  }

  @Get('tasks')
  async searchTasks(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('projectId') projectId?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('isClosed') isClosed?: string,
    @Req() req?: any,
  ) {
    return this.searchService.searchTasks(
      {
        search,
        status,
        priority,
        projectId:
          projectId !== undefined
            ? Number(projectId)
            : undefined,
        assigneeId:
          assigneeId !== undefined
            ? Number(assigneeId)
            : undefined,
        isClosed:
          isClosed !== undefined
            ? isClosed === 'true'
            : undefined,
      },
      req.user,
    );
  }
}