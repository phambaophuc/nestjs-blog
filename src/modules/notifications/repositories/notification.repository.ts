import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {
    super(
      notificationRepo.target,
      notificationRepo.manager,
      notificationRepo.queryRunner,
    );
  }

  public async findAll(): Promise<NotificationEntity[]> {
    return this.find();
  }

  public async findById(id: string): Promise<NotificationEntity | null> {
    return this.findOne({ where: { id } });
  }

  public async findByUser(id: string): Promise<NotificationEntity | null> {
    return this.findOne({ where: { user: { id } } });
  }

  public async store<T extends NotificationEntity['type']>(
    dto: CreateNotificationDto<T>,
  ): Promise<NotificationEntity> {
    const newUser = this.create(dto);
    return this.save(newUser);
  }

  public async destroy(id: string): Promise<void> {
    await this.delete(id);
  }

  public async markAsRead(id: string): Promise<void> {
    await this.update(id, { isRead: true });
  }
}
