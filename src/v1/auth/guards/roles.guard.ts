import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { EUsersRole } from '@/src/v1/users/types/user.type';

@Injectable()
export class RolesGuardV1 implements CanActivate {
  constructor(
    // private reflector: Reflector,
    private requiredRoles: EUsersRole[],
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      if (!this.requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();
      const isPermission = this.requiredRoles.some(
        (role) => user.userRole === role,
      );
      if (!isPermission) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }
      return isPermission;
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }
}
