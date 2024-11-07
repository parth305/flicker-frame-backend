import { OmitType } from '@nestjs/mapped-types';

import { Post } from '@/src/v1/posts/entities';

export class CreatePostDtoV1 extends OmitType(Post, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
