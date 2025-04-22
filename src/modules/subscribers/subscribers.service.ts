import { AppConfig } from '@config';
import { ArticleEntity } from '@entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@shared';

import { SubscriberResponseDto } from './dto';
import { SubscriberRepository } from './subscribers.repository';

@Injectable()
export class SubscribersService {
  private readonly CLIENT_URL: string;

  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly subscriberRepo: SubscriberRepository,
    private readonly emailService: EmailService,
  ) {
    this.CLIENT_URL = this.configService.get('app.clientUrl', { infer: true })!;
  }

  async findAll(): Promise<SubscriberResponseDto[]> {
    try {
      const subscribers = await this.subscriberRepo.findAll();
      return SubscriberResponseDto.fromEntities(subscribers);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendArticleForAll(article: ArticleEntity): Promise<void> {
    const subscribers = await this.subscriberRepo.findAll();

    const emailPromises = subscribers.map((subscriber) => {
      return this.emailService
        .sendEmail(
          subscriber.email,
          `New Blog: ${article.title}`,
          `<h1>${article.title}</h1><p>${article.content.substring(0, 200)}...</p><a href="${this.CLIENT_URL}/articles/${article.id}">Xem bài viết</a>`,
        )
        .catch((error) => {
          console.error(`Failed to send email to ${subscriber.email}:`, error);
        });
    });

    await Promise.all(emailPromises);
  }

  async subscribe(email: string): Promise<void> {
    try {
      const existing = await this.subscriberRepo.findByEmail(email);
      if (existing) throw new BadRequestException('Email has been registered.');

      await this.subscriberRepo.store({ email });

      return await this.emailService.sendEmail(
        email,
        'Registered successfully!',
        `<p>Thank you for subscribing to receive new articles from our blog!</p>`,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async unsubscribe(email: string): Promise<void> {
    try {
      return await this.subscriberRepo.destroyByEmail(email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
