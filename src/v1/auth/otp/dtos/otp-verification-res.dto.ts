import { IsNotEmpty } from 'class-validator';

export class OtpVerificationDto {
  message?: string;
  @IsNotEmpty()
  verified: boolean;
}
