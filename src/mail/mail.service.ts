import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(mailOptions: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  // Todo : Configure Assets Directory Through Which We Will send Mails
  //   parseTemplate(templateString: string, values: object) {}
}
