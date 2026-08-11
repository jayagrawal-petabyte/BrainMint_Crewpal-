import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

interface AuthenticatedRequest {
  user: {
    id: number;
  };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * GET /notifications
   *
   * Returns notifications belonging to the authenticated user.
   */
  @Get()
  async getNotifications(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.getUserNotifications(
      req.user.id,
    );
  }

  /**
   * GET /notifications/unread-count
   *
   * Returns the unread notification count.
   */
  @Get('unread-count')
  async getUnreadCount(
    @Req() req: AuthenticatedRequest,
  ) {
    const count =
      await this.notificationsService.getUnreadCount(
        req.user.id,
      );

    return {
      unreadCount: count,
    };
  }

  /**
   * PATCH /notifications/:id/read
   *
   * Marks one notification as read.
   */
  @Patch(':id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.markAsRead(
      id,
      req.user.id,
    );
  }

  /**
   * PATCH /notifications/read-all
   *
   * Marks all notifications belonging to the user as read.
   */
  @Patch('read-all')
  async markAllAsRead(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.markAllAsRead(
      req.user.id,
    );
  }
}