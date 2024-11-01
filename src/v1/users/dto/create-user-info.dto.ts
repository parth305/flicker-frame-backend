import { OmitType } from '@nestjs/mapped-types';

import { UserInfo } from '../entities/user-info.entity';

export class CreateUserInfoV1 extends OmitType(UserInfo, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
