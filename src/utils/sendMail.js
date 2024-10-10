import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: env(SMTP.SMTP_PORT),
  secure: false, // true for port 465, false for other ports
  auth: {
    user: env(SMTP.SMTP_USERNAME),
    pass: env(SMTP.SMTP_PASSWORD),
  },
  tls: {
    rejectUnauthorized: false, // Додаєш цю опцію
  },
});
export const sendMail = async (options) => {
  return await transporter.sendMail(options);
};
