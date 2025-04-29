/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import { TimeRange } from "../constants";

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


export function generateOtp() {
  return Math.floor(Math.random() * (999999 - 100000) + 100000);
}
export function formatFilterToDate(timeFilter: string | Date) {
  let startDate;
  const currentDate = dayjs();
  console.log(
    TimeRange.SEVEN_DAYS,
    ' ===== ',
    timeFilter,
    '  ',
    timeFilter === TimeRange.SEVEN_DAYS,
  );
  switch (timeFilter) {
    case TimeRange.TWENTY_FOUR_HOURS:
      return currentDate.subtract(24, 'hour').toDate();
      break;
    case TimeRange.SEVEN_DAYS:
      return currentDate.subtract(7, 'day').toDate();
      break;
    case TimeRange.THIRTY_DAYS:
      return currentDate.subtract(30, 'day').toDate();
      break;
    case TimeRange.ONE_MONTH:
      return currentDate.startOf('month').toDate();
      break;
    case TimeRange.THREE_MONTHS:
      return currentDate.subtract(3, 'month').startOf('month').toDate();
      break;
    case TimeRange.SIX_MONTHS:
      return currentDate.subtract(6, 'month').startOf('month').toDate();
      break;
    case TimeRange.TWELVE_MONTHS:
      return currentDate.subtract(12, 'month').startOf('month').toDate();
      break;
    case TimeRange.YEAR_TO_DATE:
      return currentDate.startOf('year').toDate();
      break;
    case TimeRange.ALL_TIME:
      return new Date(2019, 1, 0); // Depuis le commencement
      break;
    default:
      new Date();
      console.log('= =+++++ ', startDate);
      return startDate;
  }
}


export const wait = (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(timeout);
    }, timeout);
  });