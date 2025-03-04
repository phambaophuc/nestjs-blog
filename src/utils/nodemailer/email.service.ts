import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ENV } from 'src/constants/env.constants';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: ENV.EMAIL.HOST,
      port: ENV.EMAIL.PORT,
      secure: false,
      auth: {
        user: ENV.EMAIL.USER,
        pass: ENV.EMAIL.PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: ENV.EMAIL.FROM,
      to,
      subject,
      html,
    });
  }
}
