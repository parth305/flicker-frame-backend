import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ICurrentUser } from '@/src/common/interfaces/current-user.interface';
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

      const userInfo = await user.userInfo;

      // TODO : Add Redirect Logic to not allow login if email is not verified
      const isEmailVerified = user.emailVerified;
      const isCorrectPassword = await comparePassword(
        userPassword,
        user.userPassword,
      );

      if (!isCorrectPassword) {
        throw new UnauthorizedException('Invalid data');
      }
      if (!isEmailVerified) {
        await this.generateOtp(userEmail, user.userName);
      }
      const payload = { sub: user.id, userEmail: user.userEmail };
      const accessToken = await this.genAccessToken(payload);
      // Save Access Token To The DB With User ID.
      const authTokenDto = { accessToken, user };
      await this.tokenService.create(authTokenDto);
      const { userName, id } = user;

      return {
        userEmail,
        userName,
        id,
        isUserInfoExists: !!userInfo,
        accessToken,
        isEmailVerified,
      } as unknown as ResLoginDtoV1;
    } catch (err) {
      throw new UnauthorizedException('Invalid data ' + err.message);
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
    await this.generateOtp(userEmail, userName);
    return { accessToken, userName, userEmail, emailVerified: false };
  }

  async verifyOtp(
    userEmail: string,
    otpValue: number,
    currentUser: ICurrentUser,
  ) {
    try {
      if (currentUser.userEmail !== userEmail) {
        throw new UnauthorizedException(CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED);
      }
      const otpVerificationRespone = await this.otpService.verifyOtp(
        userEmail,
        otpValue,
      );
      console.log(otpVerificationRespone, '=');
      const { verified } = otpVerificationRespone;
      if (verified) {
        await this.usersService.update(
          { userEmail },
          { emailVerified: verified },
        );
      }
      return otpVerificationRespone;
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
    const user = await this.usersService.findOne({ id: userId });
    return user;
  }

  async userNameAlreadyExists(userName: string) {
    const exists = await this.usersService.exists({ userName: userName });
    return exists;
  }

  async generateOtp(userEmail: string, userName: string): Promise<void> {
    const otp = await this.otpService.generateOtp(userEmail);

    this.mailService
      .sendMail({
        to: [userEmail],
        template: './new-user-otp',
        subject: 'Welcome To Flicker Frame',
        context: {
          userName,
          otp,
          expirationTime: CONSTANTS.OTP.OTP_EXPIRY_TIME_IN_SECONDS / 60,
        },
      })
      .catch((err) => console.log(err.message));

    return;
  }

  async signInWithGoogle(currentUser: ICurrentUser) {
    // Verify If User Already Exists or Not ? If Exists Return Straight Await Else Create A New One.
    try {
      const { userEmail } = currentUser;
      const isUserAlreadyRegisterd = await this.usersService.exists({
        userEmail,
      });
      if (isUserAlreadyRegisterd) {
        // return User Straight Away
        const user = await this.usersService.findOne({ userEmail });
        if (!user.emailVerified) {
          user.emailVerified = true;
          await this.usersService.update({ userEmail }, user);
        }
        return user;
      } else {
        const { firstName, lastName, dob } = currentUser;
        const userName = await this.generateUserName(firstName, lastName);
        const userPassword = this.generatePassword(
          CONSTANTS.PASSWORD.DEFAULT_MIN_LOWER_CASE_COUNT,
          CONSTANTS.PASSWORD.DEFAULT_MIN_UPPER_CASE_COUNT,
          CONSTANTS.PASSWORD.DEFAULT_MIN_NUMBER_COUNT,
          CONSTANTS.PASSWORD.DEFAULT_MIN_SPECIAL_CHAR_COUNT,
          CONSTANTS.PASSWORD.DEFAULT_MIN_LENGTH,
        );
        const user = await this.signUp({
          userEmail,
          userName,
          userPassword,
        });
        // Adding userinfo for the same user as well.
        await this.usersService.addUserInfo(currentUser, {
          firstName,
          lastName,
          dob: new Date(dob),
          userBio: null,
          userProfilePicUri: null,
        });
        return user;
      }
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
  private async generateUserName(firstName: string, lastName: string) {
    // TODO: Find a better stretergy.
    let foundUnique = false;
    let userName;
    while (!foundUnique) {
      userName =
        (firstName || '') +
        '_' +
        (lastName || '') +
        '_' +
        Math.random() * 10000;
      foundUnique = !(await this.usersService.exists({ userName }));
    }
    return userName;
  }

  private generatePassword(
    numLowercase: number,
    numUppercase: number,
    numNumbers: number,
    numSpecialChars: number,
    totalLength: number,
  ): string {
    // Character sets for different parts of the password
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '@$!%*?&';

    // Ensure that the total length is valid
    const totalRequired =
      numLowercase + numUppercase + numNumbers + numSpecialChars;
    if (totalLength < totalRequired) {
      throw new Error(
        'Total length cannot be less than the sum of specified character counts.',
      );
    }

    // Initialize password array
    const passwordArray: string[] = [];

    // Add required number of each type of character
    for (let i = 0; i < numLowercase; i++) {
      passwordArray.push(
        lowercase[Math.floor(Math.random() * lowercase.length)],
      );
    }
    for (let i = 0; i < numUppercase; i++) {
      passwordArray.push(
        uppercase[Math.floor(Math.random() * uppercase.length)],
      );
    }
    for (let i = 0; i < numNumbers; i++) {
      passwordArray.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    for (let i = 0; i < numSpecialChars; i++) {
      passwordArray.push(
        specialChars[Math.floor(Math.random() * specialChars.length)],
      );
    }

    // Fill the rest of the password with random characters
    const allChars = lowercase + uppercase + numbers + specialChars;
    const remainingLength = totalLength - passwordArray.length;
    for (let i = 0; i < remainingLength; i++) {
      passwordArray.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle the password to randomize the order
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [
        passwordArray[j],
        passwordArray[i],
      ]; // Swap
    }

    // Return the generated password as a string
    return passwordArray.join('');
  }
  private async sendVerificationMail(userEmail: string, userName: string) {
    const otp = await this.otpService.generateOtp(userEmail);
    // Send Mail
    this.mailService
      .sendMail({
        to: [userEmail],
        template: './new-user-otp',
        subject: 'Welcome To Flicker Frame',
        context: {
          userName,
          otp,
          expirationTime: CONSTANTS.OTP.OTP_EXPIRY_TIME_IN_SECONDS / 60,
        },
      })
      .catch((err) => console.log(err.message));
    return;
  }
}
