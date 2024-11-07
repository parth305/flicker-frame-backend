import { Exclude } from 'class-transformer';

import { Post } from '@/src/v1/posts/entities';

export class ResPostDtoV1 extends Post {
  @Exclude()
  updatedAt: Date;

  count: number;
}
