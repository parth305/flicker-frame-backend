import { OmitType, PartialType } from '@nestjs/mapped-types';

import { Address } from '@/src/v1/addresses/entities';
import { ConditionUserDtoV1 } from '@/src/v1/users/dto';

export class ConditionAddressDtoV1 extends OmitType(PartialType(Address), [
  'user',
]) {
  user?: ConditionUserDtoV1;
}
