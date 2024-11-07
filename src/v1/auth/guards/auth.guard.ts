import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthServiceV1 } from '@/src/v1/auth/auth.service';
import { UsersServiceV1 } from '@/src/v1/users/users.service';

@Injectable()
export class AuthGuardV1 implements CanActivate {
  constructor(
    private authService: AuthServiceV1,
    private usersService: UsersServiceV1,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const authorizationHeader = request.headers['authorization'];
      if (!authorizationHeader) {
        throw new UnauthorizedException('Token missing');
      }
      const [tokenType, accessToken] = authorizationHeader.split(' ');
      if (tokenType !== 'Bearer' || !accessToken) {
        throw new UnauthorizedException('Invalid token');
      }
      const payload = await this.authService.verifyAccessToken(accessToken);
      const user = await this.usersService.findOne({ id: payload.sub });
      request['user'] = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
