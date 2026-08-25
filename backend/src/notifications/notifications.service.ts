import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as nodemailer from 'nodemailer';

import {
  CreateNotificationDto,
  NotificationType,
} from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly transporter: nodemailer.Transporter | null;

  constructor(
    @Inject('PG_CONNECTION')
    private readonly db: Pool,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const password = this.configService.get<string>('SMTP_PASSWORD');

    if (host && port && user && password) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass: password,
        },
      });
    } else {
      this.transporter = null;
    }
  }

  /**
   * Create an in-app or email notification.
   *
   * This method is intended to be called by other backend modules
   * or direct POST /notifications endpoint.
   */
  async createNotification(
    dto: CreateNotificationDto,
    requesterUser?: any,
  ) {
    await this.ensureUserExists(dto.userId, requesterUser);

    if (dto.type === NotificationType.EMAIL) {
      const email = dto.email ?? (await this.getUserEmail(dto.userId));

      if (!email) {
        throw new BadRequestException(
          'An email address is required for email notifications',
        );
      }

      await this.sendEmail(email, dto.title, dto.message);
    }

    const result = await this.db.query(
      `
        INSERT INTO notifications (
          user_id,
          title,
          message,
          type,
          is_read
        )
        VALUES ($1, $2, $3, $4, FALSE)
        RETURNING
          id,
          user_id,
          title,
          message,
          type,
          is_read,
          created_at
      `,
      [dto.userId, dto.title, dto.message, dto.type],
    );

    return result.rows[0];
  }

  /**
   * Get all notifications belonging to the authenticated user.
   */
  async getUserNotifications(userId: number) {
    const result = await this.db.query(
      `
        SELECT
          id,
          user_id,
          title,
          message,
          type,
          is_read,
          created_at
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC, id DESC
      `,
      [userId],
    );

    return result.rows;
  }

  /**
   * Get unread notification count for the authenticated user.
   */
  async getUnreadCount(userId: number): Promise<number> {
    const result = await this.db.query(
      `
        SELECT COUNT(*) AS unread_count
        FROM notifications
        WHERE user_id = $1
          AND is_read = FALSE
      `,
      [userId],
    );

    return Number(result.rows[0].unread_count);
  }

  /**
   * Mark one notification as read.
   */
  async markAsRead(
    notificationId: number,
    userId: number,
  ) {
    const result = await this.db.query(
      `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = $1
          AND user_id = $2
        RETURNING
          id,
          user_id,
          title,
          message,
          type,
          is_read,
          created_at
      `,
      [notificationId, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Notification ${notificationId} not found`,
      );
    }

    return result.rows[0];
  }

  /**
   * Mark all notifications belonging to the authenticated user as read.
   */
  async markAllAsRead(userId: number) {
    const result = await this.db.query(
      `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = $1
          AND is_read = FALSE
      `,
      [userId],
    );

    return {
      updatedCount: result.rowCount ?? 0,
    };
  }

  /**
   * Create an in-app notification.
   *
   * Convenience method for other backend modules.
   */
  async createInAppNotification(
    userId: number,
    title: string,
    message: string,
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type: NotificationType.IN_APP,
    });
  }

  /**
   * Send an email notification and record it in the notifications table.
   */
  async createEmailNotification(
    userId: number,
    title: string,
    message: string,
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type: NotificationType.EMAIL,
    });
  }

  private async ensureUserExists(
    userId: number,
    requesterUser?: any,
  ): Promise<void> {
    const isSuperAdmin =
      Number(requesterUser?.role_id) === 1 ||
      requesterUser?.role === 'SUPER_ADMIN';
    const orgId = requesterUser?.organization_id;

    let query = `
      SELECT id
      FROM users
      WHERE id = $1
        AND is_active = TRUE
    `;
    const params: any[] = [userId];

    if (!isSuperAdmin && orgId) {
      params.push(orgId);
      query += ` AND organization_id = $2`;
    }

    const result = await this.db.query(query, params);

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Active user ${userId} not found in your organization`,
      );
    }
  }

  private async getUserEmail(
    userId: number,
  ): Promise<string | null> {
    const result = await this.db.query(
      `
        SELECT email
        FROM users
        WHERE id = $1
          AND is_active = TRUE
      `,
      [userId],
    );

    return result.rows[0]?.email ?? null;
  }

  private async sendEmail(
    recipient: string,
    subject: string,
    message: string,
  ): Promise<void> {
    if (!this.transporter) {
      throw new BadRequestException(
        'Email notifications are not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.',
      );
    }

    const from =
      this.configService.get<string>('SMTP_FROM') ??
      this.configService.get<string>('SMTP_USER');

    if (!from) {
      throw new BadRequestException(
        'SMTP_FROM or SMTP_USER must be configured for email notifications.',
      );
    }

    await this.transporter.sendMail({
      from,
      to: recipient,
      subject,
      text: message,
    });
  }
}