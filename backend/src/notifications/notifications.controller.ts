import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.constant';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

interface AuthenticatedRequest {
  user: {
    id: number;
    organization_id: number;
    role_id: Role;
  };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * POST /notifications
   *
   * Creates a direct in-app or email notification.
   */
  @Post()
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
    Role.TEAM_LEAD,
  )
  async createNotification(
    @Body() dto: CreateNotificationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.createNotification(dto, req.user);
  }

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