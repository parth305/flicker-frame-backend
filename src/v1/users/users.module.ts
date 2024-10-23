import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/src/v1/users/entities/user.entity';
import { UsersControllerV1 } from '@/src/v1/users/users.controller';
import { UsersServiceV1 } from '@/src/v1/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersControllerV1],
  providers: [UsersServiceV1],
  exports: [UsersServiceV1],
})
export class UsersModule {}
