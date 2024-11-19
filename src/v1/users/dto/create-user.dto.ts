import { OmitType } from '@nestjs/mapped-types';

import { User } from '@/src/v1/users/entities/user.entity';

export class CreateUserDtoV1 extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'accessTokens',
  'userInfo',
]) {}
