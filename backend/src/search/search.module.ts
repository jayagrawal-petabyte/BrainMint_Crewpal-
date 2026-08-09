import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    ProjectsModule,
    TasksModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
