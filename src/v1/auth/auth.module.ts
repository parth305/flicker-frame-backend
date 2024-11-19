import { Global, Module } from '@nestjs/common';

import { MailModule } from '@/src/mail/mail.module';
import { AuthControllerV1 } from '@/src/v1/auth/auth.controller';
import { AuthServiceV1 } from '@/src/v1/auth/auth.service';
import { UsersModule } from '@/src/v1/users/users.module';

import { GoogleStrategy } from './oauth/google-oauth.helper';
import { OtpModule } from './otp/otp.module';
import { TokenModule } from '../token/token.module';

@Global()
@Module({
  imports: [UsersModule, TokenModule, MailModule, OtpModule],
  controllers: [AuthControllerV1],
  providers: [AuthServiceV1, GoogleStrategy],
  exports: [AuthServiceV1, GoogleStrategy],
})
export class AuthModule {}
