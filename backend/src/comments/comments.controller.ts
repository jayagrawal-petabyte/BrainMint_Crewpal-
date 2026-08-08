import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import type { AuthenticatedUser } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.constant';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * POST /tasks/:taskId/comments
   * Add a comment to a task.
   */
  @Post('tasks/:taskId/comments')
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
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.commentsService.createComment(taskId, dto, req.user);
  }

  /**
   * GET /tasks/:taskId/comments
   * List all comments for a specific task.
   */
  @Get('tasks/:taskId/comments')
  @HttpCode(HttpStatus.OK)
  async getTaskComments(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.commentsService.getTaskComments(taskId, req.user);
  }

  /**
   * PATCH /comments/:id
   * Update content of an existing comment.
   */
  @Patch('comments/:id')
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
  @HttpCode(HttpStatus.OK)
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.commentsService.updateComment(id, dto, req.user);
  }

  /**
   * DELETE /comments/:id
   * Delete an existing comment.
   */
  @Delete('comments/:id')
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
  @HttpCode(HttpStatus.OK)
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.commentsService.deleteComment(id, req.user);
  }
}
