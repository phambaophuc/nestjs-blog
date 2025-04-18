import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationResponseDto } from '../dtos/notification-response.dto';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async create<T extends CreateNotificationDto['type']>(
    dto: CreateNotificationDto<T>,
  ): Promise<NotificationResponseDto<T>> {
    try {
      const notification = await this.notificationRepo.store(dto);
      return NotificationResponseDto.fromEntity(notification);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByUser(userId: string) {
    try {
      return this.notificationRepo.findByUser(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  markAsRead(id: string) {
    try {
      return this.notificationRepo.markAsRead(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
