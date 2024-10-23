import { UseGuards } from '@nestjs/common';

import { RolesGuardV1 } from '@/src/v1/auth/guards';
import { EUsersRole } from '@/src/v1/users/types/user.type';

export function RoleV1(...roles: EUsersRole[]) {
  return UseGuards(new RolesGuardV1(roles));
}
