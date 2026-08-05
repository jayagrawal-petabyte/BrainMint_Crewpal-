import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Headers,
} from '@nestjs/common';
import type { TaskItem } from './tasks.service';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
} from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): TaskItem {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Headers('x-organization-id') organizationId: string): TaskItem[] {
    return this.tasksService.findAllByOrg(organizationId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('x-organization-id') organizationId: string,
  ): TaskItem {
    return this.tasksService.findOneByOrg(id, organizationId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers('x-organization-id') organizationId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): TaskItem {
    return this.tasksService.update(id, organizationId, updateTaskDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Headers('x-organization-id') organizationId: string,
    @Body('status') status: TaskStatus,
  ): TaskItem {
    return this.tasksService.updateStatus(id, organizationId, status);
  }

  @Patch(':id/assign')
  assignUser(
    @Param('id') id: string,
    @Headers('x-organization-id') organizationId: string,
    @Body('assigneeId') assigneeId: string,
  ): TaskItem {
    return this.tasksService.assignUser(id, organizationId, assigneeId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('x-organization-id') organizationId: string,
  ): { message: string } {
    return this.tasksService.remove(id, organizationId);
  }
}
