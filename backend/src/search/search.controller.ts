import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('projects')
  async searchProjects(@Query() query: any) {
    return this.searchService.searchProjects(query);
  }

  @Get('tasks')
  async searchTasks(@Query() query: any) {
    return this.searchService.searchTasks(query);
  }
}