import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import type { AuthenticatedUser, ExpressFile } from './attachments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  /**
   * POST /tasks/:taskId/attachments
   * Upload an attachment file to a task.
   */
  @Post('tasks/:taskId/attachments')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadAttachment(
    @Param('taskId', ParseIntPipe) taskId: number,
    @UploadedFile() file: ExpressFile,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.attachmentsService.uploadAttachment(taskId, file, req.user);
  }

  /**
   * GET /tasks/:taskId/attachments
   * List all attachments for a task.
   */
  @Get('tasks/:taskId/attachments')
  @HttpCode(HttpStatus.OK)
  async getTaskAttachments(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.attachmentsService.getTaskAttachments(taskId, req.user);
  }

  /**
   * GET /attachments/:id
   * Fetch single attachment metadata by ID.
   */
  @Get('attachments/:id')
  @HttpCode(HttpStatus.OK)
  async getAttachmentById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.attachmentsService.getAttachmentById(id, req.user);
  }

  /**
   * DELETE /attachments/:id
   * Delete an attachment file.
   */
  @Delete('attachments/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAttachment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.attachmentsService.deleteAttachment(id, req.user);
  }
}
