import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsController } from './sprints.controller';
import { DatabaseModule } from '../database/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SprintsController],
  providers: [SprintsService],
})
export class SprintsModule {}
