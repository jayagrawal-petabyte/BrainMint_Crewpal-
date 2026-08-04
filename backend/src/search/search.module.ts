import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/db.module';
import { ProjectsModule } from '../projects/projects.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    DatabaseModule,
    ProjectsModule,
    // Add TasksModule here once it is implemented
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}