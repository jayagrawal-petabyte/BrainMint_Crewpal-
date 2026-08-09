import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AssignTaskDto } from './dto/assign-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  /**
   * GET /sprints/:sprintId/tasks
   * List all tasks assigned to the sprint.
   * Accessible to all authenticated project members (including Client and Viewer).
   */
  @Get('sprints/:sprintId/tasks')
  @HttpCode(HttpStatus.OK)
  async getSprintTasks(
    @Param('sprintId', ParseIntPipe) sprintId: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.sprintsService.getSprintTasks(sprintId, req.user);
  }

  /**
   * POST /sprints/:sprintId/tasks
   * Assign a task to the sprint.
   * Blocked for Client (8) and Viewer (9).
   */
  @Post('sprints/:sprintId/tasks')
  @HttpCode(HttpStatus.CREATED)
  async linkTask(
    @Param('sprintId', ParseIntPipe) sprintId: number,
    @Body() body: AssignTaskDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.sprintsService.linkTask(sprintId, body.taskId, req.user);
  }

  /**
   * DELETE /sprints/:sprintId/tasks/:taskId
   * Unlink a task from the sprint (return to product backlog).
   * Blocked for Client (8) and Viewer (9).
   */
  @Delete('sprints/:sprintId/tasks/:taskId')
  @HttpCode(HttpStatus.OK)
  async unlinkTask(
    @Param('sprintId', ParseIntPipe) sprintId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.sprintsService.unlinkTask(sprintId, taskId, req.user);
  }
}
