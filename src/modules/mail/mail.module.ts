import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from 'modules/mail/mail.processor';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  providers: [MailService, MailProcessor],
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue',
      connection: {
        host: 'localhost',
        port: 6379,
        password: '123456',
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      },
      defaults: {
        from: '"Duke-Authentication" <no-reply@example.com>',
      },
      template: {
        dir:
          process.env.NODE_ENV === 'production'
            ? join(__dirname, 'templates')
            : join(process.cwd(), 'src/modules/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
