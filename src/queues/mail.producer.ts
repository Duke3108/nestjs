import { Job } from 'bullmq';
import mailQueue from 'src/queues/mail.queue';

export type MailJobData = {
  email: string;
  subject: string;
  html: string;
};

const addMailJob = async ({
  email,
  subject,
  html,
}: MailJobData): Promise<Job<MailJobData>> => {
  return await mailQueue.add('sendMail', {
    email,
    subject,
    html,
  });
};

export default addMailJob;
