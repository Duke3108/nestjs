import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {}

  async sendRegisterMail(email: string, token: string) {
    return this.mailQueue.add(
      'sendMail',
      {
        email,
        subject: 'Xác nhận đăng ký',
        template: 'register',
        context: {
          url: `${process.env.URL_SERVER}/api/v1/auth/verify-email/${token}`,
        },
      },
      { attempts: 3, backoff: 5000, removeOnComplete: true },
    );
  }

  async sendResetPasswordMail(email: string, token: string) {
    return this.mailQueue.add(
      'sendMail',
      {
        email,
        subject: 'Đặt lại mật khẩu',
        template: 'reset-password',
        context: { token },
      },
      { attempts: 3, backoff: 5000, removeOnComplete: true },
    );
  }
}
