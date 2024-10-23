import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { IPaginationParams } from '@/src/common/interfaces';
import { ConditionUserDtoV1 } from '@/src/v1/users/dto';

export class QueryParamsUserDtoV1
  extends ConditionUserDtoV1
  implements IPaginationParams
{
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  offset?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;
}
