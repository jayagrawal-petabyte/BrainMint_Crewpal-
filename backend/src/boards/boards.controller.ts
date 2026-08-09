import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  /**
   * GET /boards/:boardId/scrum-view
   * Returns the full Scrum board view for the given board.
   * Read-only — accessible to all 9 roles that are project members.
   * Boards of type 'kanban' will return 404 from this endpoint.
   */
  @Get('boards/:boardId/scrum-view')
  @HttpCode(HttpStatus.OK)
  async getScrumView(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.boardsService.getScrumView(boardId, req.user);
  }
}
