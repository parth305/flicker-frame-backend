import { OmitType } from '@nestjs/mapped-types';

import { Token } from '../entities';

export class AuthTokenDtoV1 extends OmitType(Token, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
