import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateAddressDtoV1 } from '@/src/v1/addresses/dto/create-address.dto';

export class UpdateAddressDtoV1 extends OmitType(
  PartialType(CreateAddressDtoV1),
  [],
) {}
