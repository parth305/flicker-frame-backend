import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from './entities';
import { TokenServiceV1 } from './token.service';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token]), UsersModule],
  controllers: [],
  providers: [TokenServiceV1],
  exports: [TokenServiceV1],
})
export class TokenModule {}
