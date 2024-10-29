import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

import { MailConfig } from '../config';

@Injectable()
export class MailService {
  async sendMail(
    mailTo: string | string[],
    mailSubject?: string,
    mailBody?: string,
    mailAttachments?: Attachment[],
    cc?: string[],
    bcc?: string[],
  ) {
    try {
      await nodemailer.createTransport(MailConfig).sendMail({
        from: process.env.MAIL_USER,
        to: mailTo,
        subject: mailSubject,
        text: mailBody,
        attachments: mailAttachments,
        cc,
        bcc,
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Todo : Configure Assets Directory Through Which We Will send Mails
  //   parseTemplate(templateString: string, values: object) {}
}
