import { UseGuards } from '@nestjs/common';

import { AuthGuardV1 } from '@/src/v1/auth/guards';

export function AuthenticationV1() {
  return UseGuards(AuthGuardV1);
}
