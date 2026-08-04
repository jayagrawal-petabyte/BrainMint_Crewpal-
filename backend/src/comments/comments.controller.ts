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
import { CommentsService, AuthenticatedUser } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * POST /tasks/:taskId/comments
   * Add a comment to a task.
   */
  @Post('tasks/:taskId/comments')
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
  @HttpCode(HttpStatus.OK)
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.commentsService.deleteComment(id, req.user);
  }
}
