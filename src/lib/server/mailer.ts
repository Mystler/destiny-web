import nodemailer from "nodemailer";
import { MAIL_SENDER } from "$env/static/private";

const mailer = nodemailer.createTransport({
  sendmail: true,
});

export function sendMail(target: string, subject: string, message: string) {
  mailer.sendMail({
    from: MAIL_SENDER,
    to: target,
    subject,
    text: message,
  });
}
