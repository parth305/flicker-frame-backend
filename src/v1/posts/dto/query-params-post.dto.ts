import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { IPaginationParams } from '@/src/common/interfaces';
import { ConditionPostDtoV1 } from '@/src/v1/posts/dto/condition-post.dto';

export class QueryParamsPostDtoV1
  extends ConditionPostDtoV1
  implements IPaginationParams
{
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  offset?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;
}
