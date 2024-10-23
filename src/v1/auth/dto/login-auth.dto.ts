import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDtoV1 {
  @IsEmail({}, { message: 'userEmail must be an email' })
  userEmail: string;

  @IsString({ message: 'userPassword must be a string' })
  @IsNotEmpty({ message: 'userPassword should not be empty' })
  userPassword: string;
}
