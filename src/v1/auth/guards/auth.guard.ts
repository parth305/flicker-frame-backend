import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { AUTH_CONSTANTS } from '@/src/constants/auth.constants';
import { CONSTANTS } from '@/src/constants/common.constant';
import { AuthServiceV1 } from '@/src/v1/auth/auth.service';
import { UsersServiceV1 } from '@/src/v1/users/users.service';

import { TokenServiceV1 } from '../../token/token.service';

@Injectable()
export class AuthGuardV1 implements CanActivate {
  constructor(
    private authService: AuthServiceV1,
    private usersService: UsersServiceV1,
    private tokenService: TokenServiceV1,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const authorizationHeader = request.headers['authorization'];
      if (!authorizationHeader) {
        throw new UnauthorizedException(CONSTANTS.ERROR_MESSAGE.TOKEN_MISSING);
      }
      const [tokenType, accessToken] = authorizationHeader.split(' ');
      if (tokenType !== 'Bearer' || !accessToken) {
        throw new UnauthorizedException(CONSTANTS.ERROR_MESSAGE.INVALID_TOKEN);
      }

      const payload = await this.authService.verifyAccessToken(accessToken);

      // verify if the email is verified or not
      if (!AUTH_CONSTANTS.ALLOWED_UNVERIFIED_ROUTS.includes(request.baseUrl)) {
        const isEmailVerified = await this.usersService.findOne(
          { id: payload.sub },
          { emailVerified: true },
        );
        if (!isEmailVerified)
          throw new UnauthorizedException(
            CONSTANTS.ERROR_MESSAGE.EMAIL_NOT_VERIFIED,
          );
      }
      // Verify If User Is Logged Out Or not
      const tokens = await this.tokenService.fetchAllTokensForAUser(
        payload.sub,
      );
      const isLoggedOut = !tokens
        .map(({ accessToken }) => accessToken)
        .includes(accessToken);
      if (isLoggedOut) {
        throw new UnauthorizedException(
          CONSTANTS.ERROR_MESSAGE.USER_ALREADY_LOGGED_OUT,
        );
      }

      const user = await this.usersService.findOne(
        { id: payload.sub },
        { id: true, userEmail: true, userName: true },
      );

      request['user'] = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
