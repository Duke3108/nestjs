import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis({
  host: 'localhost',
  port: 6379,
  password: '123456',
});

const mailQueue = new Queue('mail-queue', { connection });

export default mailQueue;
