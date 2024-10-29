import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CONSTANTS } from '@/src/constants/common.constant';

import { UserOtpDtoV1 } from './dtos/generate-otp.dto';
import { OtpVerificationDto } from './dtos/otp-verification-res.dto';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private userOtpRepository: Repository<Otp>,
  ) {}
  async generateOtp(userEmail: string) {
    const otp = this.generateRandomOtp();
    const validDuration = CONSTANTS.OTP.OTP_EXPIRY_TIME_IN_SECONDS * 1000;
    const userOtpDto: UserOtpDtoV1 = {
      userEmail: userEmail,
      otpAttempts: 0,
      otpValue: otp,
      expiresAt: new Date(Date.now() + validDuration),
    };
    const userOtpModel = this.userOtpRepository.create(userOtpDto);
    await this.userOtpRepository.upsert(userOtpModel, ['userEmail']);
    return otp;
  }
  async verifyOtp(
    userEmail: string,
    otpValue: number,
  ): Promise<OtpVerificationDto> {
    try {
      const userOtpModel = await this.userOtpRepository.findOneByOrFail({
        userEmail: userEmail,
      });
      const currentTimeStamp = Date.now();
      if (currentTimeStamp > userOtpModel.expiresAt.getTime()) {
        return {
          message: CONSTANTS.ERROR_MESSAGE.OTP_TIME_EXPIRED,
          verified: false,
        };
      }
      if (userOtpModel.otpAttempts == CONSTANTS.OTP.MAX_ALLOWED_ATTEMPTS) {
        return {
          message: CONSTANTS.ERROR_MESSAGE.MAX_OTP_ATTEMPTS_REACHED,
          verified: false,
        };
      }
      if (otpValue != userOtpModel.otpValue) {
        // Increment The Otp Attemps
        await this.userOtpRepository.increment(
          { userEmail: userEmail },
          'otpAttempts',
          1,
        );
        return {
          message: CONSTANTS.ERROR_MESSAGE.OTP_TIME_EXPIRED,
          verified: false,
        };
      }

      return { message: null, verified: true };
    } catch (err) {
      throw err;
    }
  }

  private generateRandomOtp() {
    const otp = Math.floor(Math.random() * Math.pow(10, CONSTANTS.OTP.LENGTH));
    return otp;
  }
}
