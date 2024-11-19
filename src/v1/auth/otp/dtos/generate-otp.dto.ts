import { OmitType } from '@nestjs/mapped-types';

import { Otp } from '../entities/otp.entity';

export class UserOtpDtoV1 extends OmitType(Otp, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
