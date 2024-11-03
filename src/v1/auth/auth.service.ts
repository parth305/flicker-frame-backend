import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ENV_VARIABLES } from '@/src/config';
import { CONSTANTS } from '@/src/constants/common.constant';
import { comparePassword } from '@/src/helpers';
import { MailService } from '@/src/mail/mail.service';
import { LoginAuthDtoV1, ResLoginDtoV1 } from '@/src/v1/auth/dto';
import { UsersServiceV1 } from '@/src/v1/users/users.service';

import { SignUpAuthDtoV1 } from './dto/sign-up-auth-dto';
import { UserSignUpResponseDtoV1 } from './dto/user-sign-up-res.dto';
import { OtpService } from './otp/otp.service';
import { TokenServiceV1 } from '../token/token.service';
import { CreateUserDtoV1 } from '../users/dto';

@Injectable()
export class AuthServiceV1 {
  constructor(
    private usersService: UsersServiceV1,
    private jwtService: JwtService,
    private tokenService: TokenServiceV1,
    private mailService: MailService,
    private otpService: OtpService,
  ) {}

  async login(loginAuthDtoV1: LoginAuthDtoV1) {
    try {
      const { userEmail, userPassword } = loginAuthDtoV1;
      const user = await this.usersService.findOne(
        { userEmail: userEmail },
        { id: true, userEmail: true, userPassword: true, emailVerified: true },
      );
      // TODO : Add Redirect Logic to not allow login if email is not verified
      const isEmailVerified = user.emailVerified;
      if (!isEmailVerified)
        throw new ForbiddenException(
          CONSTANTS.ERROR_MESSAGE.EMAIL_NOT_VERIFIED,
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
      // Save Access Token To The DB With User ID.
      const authTokenDto = { accessToken, user };
      await this.tokenService.create(authTokenDto);
      return {
        ...user,
        accessToken,
      } as unknown as ResLoginDtoV1;
    } catch (err) {
      throw new UnauthorizedException('Invalid data' + err.message);
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
      console.log('Starting To Generate Token');
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

  async signUp(signUpDto: SignUpAuthDtoV1): Promise<UserSignUpResponseDtoV1> {
    const { userName, userPassword, userEmail } = signUpDto;
    const userCreationDto: CreateUserDtoV1 = {
      userName,
      userEmail,
      userPassword,
      emailVerified: false,
    };
    const createdUser = await this.usersService.create(userCreationDto);
    //  Generate Access Token For the user
    const accessToken = await this.genAccessToken({
      sub: createdUser.id,
      userEmail,
    });
    const authTokenDto = { accessToken, user: createdUser };
    await this.tokenService.create(authTokenDto);
    // Generate OTP
    const otp = await this.otpService.generateOtp(userEmail);
    // Send Mail
    this.mailService.sendMail(
      userEmail,
      'Your Account Is Created Successfully',
      `Please Do Work Your Otp Is ${otp}`,
    );
    return { accessToken, userName, userEmail, emailVerified: false };
  }

  async verifyOtp(userEmail: string, otpValue: number) {
    try {
      const otpVerificationRespone = await this.otpService.verifyOtp(
        userEmail,
        otpValue,
      );
      const { verified } = otpVerificationRespone;
      if (verified) {
        await this.usersService.update(
          { userEmail },
          { emailVerified: verified },
        );
        return otpVerificationRespone;
      }
    } catch (err) {
      throw err;
    }
  }

  async logout(authHeader: string) {
    try {
      const payLoad = await this.verifyAccessToken(authHeader);
      const userId = payLoad?.id;

      await this.tokenService.remove(userId, authHeader);
    } catch (err) {
      throw err;
    }
  }

  async getCurrentlyLoggedInUser(accessToken: string) {
    const userId = await this.verifyAccessToken(accessToken);
    const user = this.usersService.findOne({ id: userId });
    return user;
  }

  async userNameAlreadyExists(userName: string) {
    const exists = await this.usersService.exists({ userName: userName });
    return exists;
  }
}
