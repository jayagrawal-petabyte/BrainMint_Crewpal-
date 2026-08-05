import { Role } from '../common/constants/roles.constant';
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role_id: Role;
  organization_id: number;
}

export interface ExpressFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class AttachmentsService {
  private readonly uploadDir = path.join(
    process.cwd(),
    'uploads',
    'attachments',
  );

  private readonly allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]);

  private readonly maxSizeBytes = 10 * 1024 * 1024; // 10 MB limit

  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {
    // Ensure uploads directory exists safely
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Standardized Multi-Tenant & IDOR Task Access Verification.
   */
  private async verifyTaskAccess(taskId: number, user: AuthenticatedUser) {
    if (!taskId || isNaN(taskId)) {
      throw new BadRequestException('Invalid task ID');
    }

    const query = `
      SELECT 
        t.id AS task_id,
        t.project_id,
        p.organization_id,
        (pm.user_id IS NOT NULL) AS is_member
      FROM tasks t
      JOIN projects p ON p.id = t.project_id
      LEFT JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = $1
      WHERE t.id = $2
    `;

    const result = await this.db.query(query, [user.id, taskId]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const taskInfo = result.rows[0];

    // 1. Super Admin (Role 1): Allowed cross-org access
    if (user.role_id === 1) {
      return taskInfo;
    }

    // 2. Organization Isolation: All non-Super-Admin roles must belong to the same org
    // NotFoundException (not ForbiddenException) to avoid confirming the resource exists to cross-tenant users
    if (taskInfo.organization_id !== user.organization_id) {
      throw new NotFoundException('Resource not found');
    }

    // 3. Role 2: Org Admin (all projects within their org)
    if (user.role_id === 2) {
      return taskInfo;
    }

    // 4. Roles 3-9: Must be an active member of the project
    if (!taskInfo.is_member) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    return taskInfo;
  }

  /**
   * Upload an attachment file to a task.
   */
  async uploadAttachment(
    taskId: number,
    file: ExpressFile,
    user: AuthenticatedUser,
  ) {
    // Viewer role (Role 9) cannot upload attachments
    if (user.role_id === 9) {
      throw new ForbiddenException(
        'Viewer role is read-only and cannot upload attachments',
      );
    }

    // Fail-fast: validate file existence before any DB access
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // File size check (server-side, before IDOR check to avoid unnecessary DB queries)
    if (file.size > this.maxSizeBytes) {
      throw new BadRequestException('File size exceeds maximum limit of 10MB');
    }

    // File MIME type whitelist check (client-provided Content-Type)
    if (!this.allowedMimeTypes.has(file.mimetype)) {
      throw new BadRequestException(
        `File type '${file.mimetype}' is not permitted. Allowed formats: images, PDF, Word, Excel, ZIP, TXT.`,
      );
    }

    // File extension whitelist (defence against MIME spoofing — e.g. .exe renamed to .png)
    const allowedExtensions = new Set([
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.pdf',
      '.doc',
      '.docx',
      '.txt',
      '.zip',
      '.xls',
      '.xlsx',
    ]);
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(fileExt)) {
      throw new BadRequestException(
        `File extension '${fileExt}' is not permitted`,
      );
    }

    // Multi-tenant IDOR check (after file validation to fail fast on bad input)
    await this.verifyTaskAccess(taskId, user);

    // Sanitize original filename (prevent path traversal / malicious chars)
    const sanitizedOriginalName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeFilename = `${randomUUID()}-${sanitizedOriginalName}`;
    const targetFilePath = path.join(this.uploadDir, safeFilename);

    // Save file safely to uploads directory
    await fs.promises.writeFile(targetFilePath, file.buffer);

    const relativeFileUrl = `/uploads/attachments/${safeFilename}`;

    const insertQuery = `
      INSERT INTO attachments (task_id, uploaded_by, file_name, file_url, file_size, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, task_id AS "taskId", uploaded_by AS "uploadedBy", file_name AS "fileName", file_url AS "fileUrl", file_size AS "fileSize", created_at AS "createdAt"
    `;

    const result = await this.db.query(insertQuery, [
      taskId,
      user.id,
      sanitizedOriginalName,
      relativeFileUrl,
      file.size,
    ]);

    const newAttachment = result.rows[0];

    return {
      message: 'Attachment uploaded successfully',
      attachment: newAttachment,
    };
  }

  /**
   * Get all attachments for a specific task.
   */
  async getTaskAttachments(taskId: number, user: AuthenticatedUser) {
    // Multi-tenant IDOR check
    await this.verifyTaskAccess(taskId, user);

    const selectQuery = `
      SELECT 
        a.id,
        a.task_id AS "taskId",
        a.uploaded_by AS "uploadedBy",
        u.name AS "uploaderName",
        a.file_name AS "fileName",
        a.file_url AS "fileUrl",
        a.file_size AS "fileSize",
        a.created_at AS "createdAt"
      FROM attachments a
      JOIN users u ON u.id = a.uploaded_by
      WHERE a.task_id = $1
      ORDER BY a.created_at DESC
    `;

    const result = await this.db.query(selectQuery, [taskId]);

    return {
      taskId,
      total: result.rows.length,
      attachments: result.rows,
    };
  }

  /**
   * Get single attachment metadata by ID.
   */
  async getAttachmentById(attachmentId: number, user: AuthenticatedUser) {
    if (!attachmentId || isNaN(attachmentId)) {
      throw new BadRequestException('Invalid attachment ID');
    }

    const query = `
      SELECT 
        a.id,
        a.task_id AS "taskId",
        a.uploaded_by AS "uploadedBy",
        u.name AS "uploaderName",
        a.file_name AS "fileName",
        a.file_url AS "fileUrl",
        a.file_size AS "fileSize",
        a.created_at AS "createdAt",
        t.project_id,
        p.organization_id,
        (pm.user_id IS NOT NULL) AS is_member
      FROM attachments a
      JOIN tasks t ON t.id = a.task_id
      JOIN projects p ON p.id = t.project_id
      JOIN users u ON u.id = a.uploaded_by
      LEFT JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = $1
      WHERE a.id = $2
    `;

    const result = await this.db.query(query, [user.id, attachmentId]);

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Attachment with ID ${attachmentId} not found`,
      );
    }

    const attachmentInfo = result.rows[0];

    // 1. Organization check: hide resource existence from cross-tenant users
    if (
      user.role_id !== 1 &&
      attachmentInfo.organization_id !== user.organization_id
    ) {
      throw new NotFoundException('Resource not found');
    }

    // 2. Project membership check: user is in the org but not the project
    if (user.role_id !== 1 && user.role_id !== 2 && !attachmentInfo.is_member) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    return {
      id: attachmentInfo.id,
      taskId: attachmentInfo.taskId,
      uploadedBy: attachmentInfo.uploadedBy,
      uploaderName: attachmentInfo.uploaderName,
      fileName: attachmentInfo.fileName,
      fileUrl: attachmentInfo.fileUrl,
      fileSize: attachmentInfo.fileSize,
      createdAt: attachmentInfo.createdAt,
    };
  }

  /**
   * Delete an attachment.
   */
  async deleteAttachment(attachmentId: number, user: AuthenticatedUser) {
    if (!attachmentId || isNaN(attachmentId)) {
      throw new BadRequestException('Invalid attachment ID');
    }

    // Viewer role (Role 9) cannot delete attachments
    if (user.role_id === 9) {
      throw new ForbiddenException('Viewer role cannot delete attachments');
    }

    const query = `
      SELECT 
        a.id,
        a.task_id,
        a.uploaded_by,
        a.file_url,
        t.project_id,
        p.organization_id,
        (pm.user_id IS NOT NULL) AS is_member
      FROM attachments a
      JOIN tasks t ON t.id = a.task_id
      JOIN projects p ON p.id = t.project_id
      LEFT JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = $1
      WHERE a.id = $2
    `;

    const result = await this.db.query(query, [user.id, attachmentId]);

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Attachment with ID ${attachmentId} not found`,
      );
    }

    const attachmentInfo = result.rows[0];

    // 1. Organization check: hide resource existence from cross-tenant users
    if (
      user.role_id !== 1 &&
      attachmentInfo.organization_id !== user.organization_id
    ) {
      throw new NotFoundException('Resource not found');
    }

    // 2. Project membership check: user is in the org but not the project
    if (user.role_id !== 1 && user.role_id !== 2 && !attachmentInfo.is_member) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    // 3. Authorization check: Uploader OR Privileged Admins (Super Admin 1, Org Admin 2, Project Admin 3, PM 4)
    const isUploader = attachmentInfo.uploaded_by === user.id;
    const isPrivilegedAdmin = [1, 2, 3, 4].includes(user.role_id);

    if (!isUploader && !isPrivilegedAdmin) {
      throw new ForbiddenException(
        'You can only delete your own uploaded attachments',
      );
    }

    // Remove file from disk if it exists
    if (attachmentInfo.file_url) {
      const fileNameOnDisk = path.basename(attachmentInfo.file_url);
      const filePathOnDisk = path.join(this.uploadDir, fileNameOnDisk);
      if (fs.existsSync(filePathOnDisk)) {
        try {
          await fs.promises.unlink(filePathOnDisk);
        } catch {
          // File deletion warning logged, DB record will still be cleaned
        }
      }
    }

    await this.db.query('DELETE FROM attachments WHERE id = $1', [
      attachmentId,
    ]);

    return {
      message: 'Attachment deleted successfully',
      id: attachmentId,
    };
  }
}
