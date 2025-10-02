import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from 'src/modules/mail/mail.processor';

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
  ],
  exports: [MailService],
})
export class MailModule {}
