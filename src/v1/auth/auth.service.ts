import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ENV_VARIABLES } from '@/src/config';
import { comparePassword } from '@/src/helpers';
import { LoginAuthDtoV1, ResLoginDtoV1 } from '@/src/v1/auth/dto';
import { UsersServiceV1 } from '@/src/v1/users/users.service';

import { TokenServiceV1 } from '../token/token.service';

@Injectable()
export class AuthServiceV1 {
  constructor(
    private usersService: UsersServiceV1,
    private jwtService: JwtService,
    private tokenServiec: TokenServiceV1,
  ) {}

  async login(loginAuthDtoV1: LoginAuthDtoV1) {
    try {
      const { userEmail, userPassword } = loginAuthDtoV1;
      const user = await this.usersService.findOne(
        { userEmail: userEmail },
        { id: true, userEmail: true, userPassword: true },
      );
      const isCorrectPassword = await comparePassword(
        userPassword,
        user.userPassword,
      );
      if (!isCorrectPassword) {
        throw new UnauthorizedException('Invalid data');
      }
      const payload = { sub: user.id, userEmail: user.userEmail };
      const accessToken = await this.genAccessToken(payload);
      // Save Access Token To The DB.
      const authTokenDto = { accessToken, user };
      await this.tokenServiec.create(authTokenDto);
      return {
        ...user,
        accessToken,
      } as unknown as ResLoginDtoV1;
    } catch (err) {
      throw new UnauthorizedException('Invalid data');
    }
  }

  async genJWT(
    payload: object,
    tokenSecret: string,
    tokenExpire: string | number,
  ) {
    try {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: tokenExpire,
        secret: tokenSecret,
      });
      return token;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyJWT(token: string, tokenSecret: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: tokenSecret,
      });
      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async genAccessToken(data: object) {
    try {
      const accessToken = await this.genJWT(
        data,
        ENV_VARIABLES.ACCESS_TOKEN_SECRET,
        ENV_VARIABLES.ACCESS_TOKEN_EXPIRATION,
      );
      return accessToken;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyAccessToken(token: string) {
    try {
      const payload = await this.verifyJWT(
        token,
        ENV_VARIABLES.ACCESS_TOKEN_SECRET,
      );
      return payload;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
