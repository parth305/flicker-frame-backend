import { PartialType } from '@nestjs/mapped-types';

import { Post } from '@/src/v1/posts/entities';

export class ConditionPostDtoV1 extends PartialType(Post) {}
