import { ApiProperty } from '@nestjs/swagger';

import {
  NotificationEntity,
  NotificationType,
} from '../entities/notification.entity';
import { NotificationDataMap } from '../types/notification-data.type';

export class NotificationResponseDto<
  T extends NotificationType = NotificationType,
> {
  @ApiProperty({ example: 'notification-1' })
  id: string;

  @ApiProperty({ example: 'comment' })
  type: T;

  @ApiProperty()
  data: NotificationDataMap[T];

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: '2025-04-18T12:00:00.000Z' })
  createdAt: Date;

  static fromEntity<T extends NotificationType>(
    notification: NotificationEntity,
  ): NotificationResponseDto<T> {
    return {
      id: notification.id,
      type: notification.type as T,
      data: notification.data as NotificationDataMap[T],
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }

  static fromEntities<T extends NotificationType>(
    notifications: NotificationEntity[],
  ): NotificationResponseDto<T>[] {
    return notifications.map((notification) =>
      NotificationResponseDto.fromEntity(notification),
    );
  }
}
