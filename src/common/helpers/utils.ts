/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

export function SendEmail(email: string, message: string, subject?: string, attachments?: { filename: string; path: string }[]) {
  // console.log(email, '--', message);

  console.log('envoi du mail');

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465, //25,
    // secure: false,
    //service: 'gmail',
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_SENDER,
    to: email,
    subject: subject || 'NEXTISE NOTIFICATION',
    // text: message,
    html: message,
    attachments: attachments || [],
  };

  try {
    transporter?.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        Logger.log(error);
      } else {
        Logger.log('Email sent: ' + info.response);
      }
    });
  } catch (err) {
    Logger.log('error send mail ', err);
  }
}


export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const wait = (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(timeout);
    }, timeout);
  });