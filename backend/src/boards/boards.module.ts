import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { DatabaseModule } from '../database/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
