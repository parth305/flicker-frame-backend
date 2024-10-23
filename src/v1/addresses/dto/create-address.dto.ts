import { OmitType } from '@nestjs/mapped-types';

import { Address } from '@/src/v1/addresses/entities';

export class CreateAddressDtoV1 extends OmitType(Address, ['id']) {}
