import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
