import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';
import { MailConfig } from '../config';

@Module({
  imports: [MailerModule.forRoot(MailConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
