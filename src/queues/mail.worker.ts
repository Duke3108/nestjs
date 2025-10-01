import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
import { Worker } from "bullmq";
import { Redis } from "ioredis";
import nodemailer from "nodemailer";

const connection = new Redis({
  host: "localhost",
  port: 6379,
  password: "123456",
  maxRetriesPerRequest: null,
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_NAME || "tuockhuu57@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD || "zeihotiwxlxwrduh",
  },
});

const worker = new Worker(
  "mail-queue",
  async (job) => {
    const { email, subject, html } = job.data;
    const info = await transporter.sendMail({
      from: '"Duke-Authentication" <no-reply>',
      to: email,
      subject,
      html,
    });
    console.log("Mail sent:", info.messageId);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
