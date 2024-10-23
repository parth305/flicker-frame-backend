import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateUserDtoV1 } from '@/src/v1/users/dto';
export class UpdateUserDtoV1 extends OmitType(PartialType(CreateUserDtoV1), [
  'userEmail',
]) {}
