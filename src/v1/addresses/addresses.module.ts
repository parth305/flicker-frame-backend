import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressesControllerV1 } from '@/src/v1/addresses/addresses.controller';
import { AddressesServiceV1 } from '@/src/v1/addresses/addresses.service';
import { Address } from '@/src/v1/addresses/entities';
import { UsersModule } from '@/src/v1/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UsersModule],
  controllers: [AddressesControllerV1],
  providers: [AddressesServiceV1],
})
export class AddressesModule {}
