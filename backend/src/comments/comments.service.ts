import { Role } from '../common/constants/roles.constant';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

const PRIVILEGED_ROLES = new Set<Role>([
  Role.SUPER_ADMIN,
  Role.ORG_ADMIN,
  Role.PROJECT_ADMIN,
  Role.PROJECT_MANAGER,
]);

@Injectable()
export class CommentsService {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  /**
   * Helper method to verify task existence and validate user access (IDOR check).
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

    // Role-based scope verification
    // Role 1: Super Admin (all access across orgs)
    if (user.role_id === Role.SUPER_ADMIN) {
      return taskInfo;
    }

    // Organization-level check: NotFoundException (not ForbiddenException) to avoid
    // confirming resource existence to users outside this tenant
    if (taskInfo.organization_id !== user.organization_id) {
      throw new NotFoundException('Resource not found');
    }

    // Role 2: Org Admin (all projects within their org)
    if (user.role_id === Role.ORG_ADMIN) {
      return taskInfo;
    }

    // Roles 3-9: Must be an active member of the project
    if (!taskInfo.is_member) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    return taskInfo;
  }

  /**
   * Add a comment to a task.
   */
  async createComment(
    taskId: number,
    dto: CreateCommentDto,
    user: AuthenticatedUser,
  ) {
    // Viewer role (Role 9) cannot add comments
    if (user.role_id === Role.VIEWER) {
      throw new ForbiddenException(
        'Viewer role is read-only and cannot post comments',
      );
    }

    // Verify task existence and user authorization (IDOR Check)
    await this.verifyTaskAccess(taskId, user);

    const insertQuery = `
      INSERT INTO comments (task_id, user_id, content, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, task_id, user_id, content, created_at, updated_at
    `;

    const insertResult = await this.db.query(insertQuery, [
      taskId,
      user.id,
      dto.content.trim(),
    ]);

    const newComment = insertResult.rows[0];

    return {
      message: 'Comment added successfully',
      comment: {
        id: newComment.id,
        taskId: newComment.task_id,
        userId: newComment.user_id,
        content: newComment.content,
        createdAt: newComment.created_at,
        updatedAt: newComment.updated_at,
      },
    };
  }

  /**
   * Get all comments for a specific task.
   */
  async getTaskComments(taskId: number, user: AuthenticatedUser) {
    // Verify task existence and user authorization (IDOR Check)
    await this.verifyTaskAccess(taskId, user);

    const selectQuery = `
      SELECT 
        c.id,
        c.task_id AS "taskId",
        c.user_id AS "userId",
        u.name AS "authorName",
        c.content,
        c.created_at AS "createdAt",
        c.updated_at AS "updatedAt"
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.task_id = $1
      ORDER BY c.created_at ASC
    `;

    const result = await this.db.query(selectQuery, [taskId]);

    return {
      taskId,
      total: result.rows.length,
      comments: result.rows,
    };
  }

  /**
   * Update an existing comment.
   */
  async updateComment(
    commentId: number,
    dto: UpdateCommentDto,
    user: AuthenticatedUser,
  ) {
    if (!commentId || isNaN(commentId)) {
      throw new BadRequestException('Invalid comment ID');
    }

    // Viewer role (Role 9) cannot edit comments. Clients (Role 8) can edit their own author comments.
    if (user.role_id === Role.VIEWER) {
      throw new ForbiddenException('Viewer role cannot update comments');
    }

    const findQuery = `
      SELECT 
        c.id,
        c.task_id,
        c.user_id AS author_id,
        c.content,
        t.project_id,
        p.organization_id,
        (pm.user_id IS NOT NULL) AS is_member
      FROM comments c
      JOIN tasks t ON t.id = c.task_id
      JOIN projects p ON p.id = t.project_id
      LEFT JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = $1
      WHERE c.id = $2
    `;

    const result = await this.db.query(findQuery, [user.id, commentId]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    const commentInfo = result.rows[0];

    // Organization check: hide resource existence from cross-tenant users
    if (
      user.role_id !== Role.SUPER_ADMIN &&
      commentInfo.organization_id !== user.organization_id
    ) {
      throw new NotFoundException('Resource not found');
    }

    // Project membership check: user is in the org but not the project
    if (
      user.role_id !== Role.SUPER_ADMIN &&
      user.role_id !== Role.ORG_ADMIN &&
      !commentInfo.is_member
    ) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    // Authorization check: Only author or privileged admin roles (Super Admin, Org Admin, Project Admin, PM)
    const isAuthor = commentInfo.author_id === user.id;
    const isPrivilegedAdmin = PRIVILEGED_ROLES.has(user.role_id);

    if (!isAuthor && !isPrivilegedAdmin) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const updateQuery = `
      UPDATE comments
      SET content = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, task_id AS "taskId", user_id AS "userId", content, created_at AS "createdAt", updated_at AS "updatedAt"
    `;

    const updateResult = await this.db.query(updateQuery, [
      dto.content.trim(),
      commentId,
    ]);

    return {
      message: 'Comment updated successfully',
      comment: updateResult.rows[0],
    };
  }

  /**
   * Delete a comment.
   */
  async deleteComment(commentId: number, user: AuthenticatedUser) {
    if (!commentId || isNaN(commentId)) {
      throw new BadRequestException('Invalid comment ID');
    }

    // Viewer role (Role 9) cannot delete comments
    if (user.role_id === Role.VIEWER) {
      throw new ForbiddenException('Viewer role cannot delete comments');
    }

    const findQuery = `
      SELECT 
        c.id,
        c.task_id,
        c.user_id AS author_id,
        t.project_id,
        p.organization_id,
        (pm.user_id IS NOT NULL) AS is_member
      FROM comments c
      JOIN tasks t ON t.id = c.task_id
      JOIN projects p ON p.id = t.project_id
      LEFT JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = $1
      WHERE c.id = $2
    `;

    const result = await this.db.query(findQuery, [user.id, commentId]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    const commentInfo = result.rows[0];

    // Organization check: hide resource existence from cross-tenant users
    if (
      user.role_id !== Role.SUPER_ADMIN &&
      commentInfo.organization_id !== user.organization_id
    ) {
      throw new NotFoundException('Resource not found');
    }

    // Project membership check: user is in the org but not the project
    if (
      user.role_id !== Role.SUPER_ADMIN &&
      user.role_id !== Role.ORG_ADMIN &&
      !commentInfo.is_member
    ) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    // Authorization check: Only author or privileged admin roles (Super Admin, Org Admin, Project Admin, PM)
    const isAuthor = commentInfo.author_id === user.id;
    const isPrivilegedAdmin = PRIVILEGED_ROLES.has(user.role_id);

    if (!isAuthor && !isPrivilegedAdmin) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.db.query('DELETE FROM comments WHERE id = $1', [commentId]);

    return {
      message: 'Comment deleted successfully',
      id: commentId,
    };
  }
}
