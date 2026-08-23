import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.constant';

@Controller('sprints')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  /**
   * GET /sprints
   * List all sprints accessible to the requester (filtered by project or status).
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('projectId') projectId: string,
    @Query('status') status: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    const parsedProjectId = projectId ? parseInt(projectId, 10) : undefined;
    return this.sprintsService.findAll(req.user, {
      projectId: parsedProjectId,
      status,
    });
  }

  /**
   * GET /sprints/:id
   * Get single sprint details.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.sprintsService.findOne(id, req.user);
  }

  /**
   * POST /sprints
   * Create a new sprint in a project.
   * Restricted: Client and Viewer cannot create sprints.
   */
  @Post()
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
    Role.DESIGNER,
    Role.QA_TESTER,
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSprintDto: CreateSprintDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.sprintsService.create(createSprintDto, req.user);
  }

  /**
   * PATCH /sprints/:id
   * Update an existing sprint.
   */
  @Patch(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
    Role.DESIGNER,
    Role.QA_TESTER,
  )
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSprintDto: UpdateSprintDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.sprintsService.update(id, updateSprintDto, req.user);
  }

  /**
   * DELETE /sprints/:id
   * Delete a sprint and return linked tasks to backlog.
   */
  @Delete(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
  )
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.sprintsService.delete(id, req.user);
  }

  /**
   * GET /sprints/:sprintId/tasks
   * List all tasks assigned to the sprint.
   */
  @Get(':sprintId/tasks')
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
   */
  @Post(':sprintId/tasks')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
    Role.DESIGNER,
    Role.QA_TESTER,
  )
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
   */
  @Delete(':sprintId/tasks/:taskId')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
    Role.DESIGNER,
    Role.QA_TESTER,
  )
  @HttpCode(HttpStatus.OK)
  async unlinkTask(
    @Param('sprintId', ParseIntPipe) sprintId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.sprintsService.unlinkTask(sprintId, taskId, req.user);
  }
}
