import { PartialType } from '@nestjs/mapped-types';

import { User } from '@/src/v1/users/entities/user.entity';

export class ConditionUserDtoV1 extends PartialType(User) {}
