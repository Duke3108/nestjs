import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import nodemailer from 'nodemailer';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  async process(job: Job<any, any, string>): Promise<any> {
    const { email, subject, html } = job.data;
    const info = await this.transporter.sendMail({
      from: '"Duke-Authentication" <no-reply>',
      to: email,
      subject,
      html,
    });
    console.log(`Mail sent to ${email}`);
    return info;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} done`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`Job ${job.id} failed:`, err.message);
  }
}
