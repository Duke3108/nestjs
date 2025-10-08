import { MailerService } from '@nestjs-modules/mailer';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailJobData } from 'common/interfaces';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<MailJobData, void, string>): Promise<void> {
    const { email, subject, html, template, context } = job.data;

    if (template) {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template,
        context,
      });
    } else {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
    }
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
