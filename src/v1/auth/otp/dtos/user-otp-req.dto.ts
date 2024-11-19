import { IsNotEmpty } from 'class-validator';

export class UserOtpRequestDto {
  @IsNotEmpty({ message: 'Please Provide the valid email' })
  userEmail: string;
  @IsNotEmpty({ message: 'Please Provide the value of otp' })
  otpValue: number;
}
