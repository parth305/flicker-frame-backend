import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsValidPassword } from '../decorators/validate-password.decorator';

export class SignUpAuthDtoV1 {
  @IsEmail({}, { message: 'User Email must be a valid email address' })
  userEmail: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsValidPassword()
  userPassword: string;

  @IsNotEmpty({ message: 'UserName must be provided.' })
  userName: string;
}
