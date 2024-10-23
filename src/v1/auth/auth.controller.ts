import { Controller, Post, Body } from '@nestjs/common';

import { Serializer } from '@/src/common/decorators';
import { IResponse } from '@/src/common/interfaces';
import { AuthServiceV1 } from '@/src/v1/auth/auth.service';
import { LoginAuthDtoV1, ResLoginDtoV1 } from '@/src/v1/auth/dto';

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
}
