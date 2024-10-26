import { Global, Module } from '@nestjs/common';

import { AuthControllerV1 } from '@/src/v1/auth/auth.controller';
import { AuthServiceV1 } from '@/src/v1/auth/auth.service';
import { UsersModule } from '@/src/v1/users/users.module';

import { TokenModule } from '../token/token.module';

@Global()
@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthControllerV1],
  providers: [AuthServiceV1],
  exports: [AuthServiceV1],
})
export class AuthModule {}
