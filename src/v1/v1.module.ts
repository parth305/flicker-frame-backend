import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressesModule } from '@/src/v1/addresses/addresses.module';
import { AuthModule } from '@/src/v1/auth/auth.module';
import { User } from '@/src/v1/users/entities/user.entity';
import { UsersModule } from '@/src/v1/users/users.module';
import { V1Controller } from '@/src/v1/v1.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    AddressesModule,
  ],
  controllers: [V1Controller],
  providers: [],
})
export class V1Module {}
