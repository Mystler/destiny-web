import nodemailer from "nodemailer";
import { env } from "$env/dynamic/private";

const mailer = nodemailer.createTransport({
  sendmail: true,
});

export function sendMail(target: string, subject: string, message: string) {
  mailer.sendMail({
    from: env.MAIL_SENDER,
    to: target,
    subject,
    text: message,
  });
}
