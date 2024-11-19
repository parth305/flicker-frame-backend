import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import SMTPPool from 'nodemailer/lib/smtp-pool';

const MAIL_TRANSPORTS: SMTPPool.Options | SMTPPool = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT || 587),
  secure: false,
  pool: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};
const MAIL_DEFAULTS = {
  from: process.env.MAIL_USER,
};
console.log(__dirname);
const MAIL_TEMPLATES = {
  dir: __dirname + '/../mail/templates/',
  adapter: new EjsAdapter(),
};

export const MailConfig: MailerOptions = {
  transport: MAIL_TRANSPORTS,
  defaults: MAIL_DEFAULTS,
  template: MAIL_TEMPLATES,
};
