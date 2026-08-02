import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../constants/roles.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || user.role_id === undefined) {
      this.logger.warn(
        `Access denied — no user/role on request to ${context.getHandler().name}`,
      );
      throw new ForbiddenException('Access denied');
    }

    const hasRole = requiredRoles.includes(user.role_id);

    if (!hasRole) {
      this.logger.warn(
        `Role ${user.role_id} denied access to ${context.getHandler().name} ` +
          `(requires: ${requiredRoles.join(', ')}) — user ${user.id}`,
      );
      throw new ForbiddenException('You do not have the required role to access this resource');
    }

    return true;
  }
}