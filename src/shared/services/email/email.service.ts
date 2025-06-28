import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { AppConfig } from '@/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const host = this.configService.get('email.host', { infer: true })!;
    const port = this.configService.get('email.port', { infer: true })!;
    const user = this.configService.get('email.user', { infer: true })!;
    const pass = this.configService.get('email.pass', { infer: true })!;

    this.from = this.configService.get('email.from', { infer: true })!;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}
