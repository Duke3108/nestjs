import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {}

  async sendRegisterMail(email: string, token: string) {
    const html = `<p>Vui lòng click vào đường link bên dưới để xác thực tài khoản (Lưu ý: liên kết này sẽ hết hạn sau 15 phút)</p>
    <a href="${process.env.URL_SERVER}/api/v1/auth/verify-email/${token}">Xác thực tài khoản</a>`;
    return this.mailQueue.add(
      'sendMail',
      { email, subject: 'Xác nhận đăng ký', html },
      {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
      },
    );
  }

  async sendResetPasswordMail(email: string, token: string) {
    const html = `<p>(Lưu ý: mã xác thực sẽ hết hạn sau 15 phút)</p>
      <p>Mã xác thực của bạn là: <strong>${token}</strong></p>`;
    return this.mailQueue.add(
      'sendMail',
      { email, subject: 'Đặt lại mật khẩu', html },
      {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
      },
    );
  }
}
