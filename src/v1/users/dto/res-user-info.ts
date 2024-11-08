import { OmitType, PartialType } from '@nestjs/mapped-types';

import { UserInfo } from '../entities/user-info.entity';

export class ResUserInfoDtoV1 extends OmitType(PartialType(UserInfo), [
  'id',
  'user',
  'createdAt',
  'updatedAt',
]) {}
