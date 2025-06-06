import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import dotenv from "dotenv";
import { MailOptions } from "nodemailer/lib/json-transport";

dotenv.config();

const host = process.env.EMAIL_HOST ?? "localhost";
const port = process.env.EMAIL_PORT ?? "80";
const user = process.env.EMAIL_USERNAME ?? "username";
const pass = process.env.EMAIL_PASSWORD ?? "password";

const portNumber: number = parseInt(port, 10);
if (isNaN(portNumber)) {
  throw new Error(`Invalid EMAIL_PORT value: ${port}. Must be a valid number.`);
}

const smtpOptions: SMTPTransport.Options = {
  host,
  port: portNumber,
  auth: {
    user,
    pass,
  },
};

const transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> = nodemailer.createTransport(smtpOptions);

export const sendMail = async (options: MailOptions) => {
  try {
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
