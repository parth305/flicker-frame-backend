import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@/src/app.controller';
import { AppService } from '@/src/app.service';
import { jwtConfig, throttlerConfig, typeOrmConfig } from '@/src/config';
import { V1Module } from '@/src/v1/v1.module';

@Module({
  imports: [
    V1Module,
    ThrottlerModule.forRoot(throttlerConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    JwtModule.register(jwtConfig),
    // CacheModule.registerAsync(cacheConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
