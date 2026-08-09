/* eslint-disable */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.constant';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
    Role.DESIGNER,
    Role.QA_TESTER,
    Role.CLIENT,
  )
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.tasksService.findAll(req.user);
  }

  @Get('search')
  searchTasks(@Query() filters: any, @Req() req: any) {
    return this.tasksService.searchTasks(filters, req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.tasksService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
    Role.DESIGNER,
    Role.QA_TESTER,
    Role.CLIENT,
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user);
  }

  @Patch(':id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
    Role.DESIGNER,
    Role.QA_TESTER,
    Role.CLIENT,
  )
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req: any,
  ) {
    return this.tasksService.updateStatus(id, dto, req.user);
  }

  @Patch(':id/assign')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
  )
  assignUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.assignUser(id, dto.assigneeId, req.user);
  }

  @Delete(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
  )
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.tasksService.remove(id, req.user);
  }
}