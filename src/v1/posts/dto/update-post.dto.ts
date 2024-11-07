import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreatePostDtoV1 } from '@/src/v1/posts/dto/create-post.dto';

export class UpdatePostDtoV1 extends OmitType(PartialType(CreatePostDtoV1), [
  'user',
]) {}
