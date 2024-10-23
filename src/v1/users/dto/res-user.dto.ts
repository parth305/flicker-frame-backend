import { Exclude } from 'class-transformer';

import { User } from '@/src/v1/users/entities/user.entity';

export class ResUserDtoV1 extends User {
  @Exclude()
  userPassword: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  count: number;
}
