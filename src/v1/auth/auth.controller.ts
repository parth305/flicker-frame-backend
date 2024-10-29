import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { Serializer } from '@/src/common/decorators';
import { IResponse } from '@/src/common/interfaces';
import { AuthServiceV1 } from '@/src/v1/auth/auth.service';
import { LoginAuthDtoV1, ResLoginDtoV1 } from '@/src/v1/auth/dto';

import { SignUpAuthDtoV1 } from './dto/sign-up-auth-dto';
import { UserSignUpResponseDtoV1 } from './dto/user-sign-up-res.dto';
import { AuthGuardV1 } from './guards';
import { UserOtpRequestDto } from './otp/dtos/user-otp-req.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthControllerV1 {
  constructor(private readonly authService: AuthServiceV1) {}

  @Serializer(ResLoginDtoV1)
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDtoV1,
  ): Promise<IResponse<ResLoginDtoV1>> {
    const loginData = await this.authService.login(loginAuthDto);
    return { data: loginData, message: 'Login successfully' };
  }

  @Post('signUp')
  async signUp(
    @Body() signUpAuthDto: SignUpAuthDtoV1,
  ): Promise<IResponse<UserSignUpResponseDtoV1>> {
    const signUpResponse = await this.authService.signUp(signUpAuthDto);
    return { data: signUpResponse, message: 'Otp Has Generated Succesfully' };
  }

  @Post('verifyOtp')
  @UseGuards(AuthGuardV1)
  async verifyOtp(@Body() userOtpRequest: UserOtpRequestDto) {
    const { userEmail, otpValue } = userOtpRequest;
    const { verified, message } = await this.authService.verifyOtp(
      userEmail,
      otpValue,
    );
    if (verified) return { message: 'Otp Verified Successfully' };
    else return { message };
  }

  @Get('logout')
  @UseGuards(AuthGuardV1)
  async logout() {}
}
