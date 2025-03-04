import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriberRepository } from '../repositories/subscribers.repository';
import { EmailService } from 'src/utils/nodemailer/email.service';
import { SubscriberResponseDto } from '../dtos/subscriber-response.dto';

@Injectable()
export class SubscribersService {
  constructor(
    private readonly subscriberRepo: SubscriberRepository,
    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<SubscriberResponseDto[]> {
    try {
      const subscribers = await this.subscriberRepo.findAll();
      return SubscriberResponseDto.fromEntities(subscribers);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
