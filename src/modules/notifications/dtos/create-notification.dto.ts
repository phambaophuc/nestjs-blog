import { ApiProperty } from '@nestjs/swagger';

import { NotificationType } from '../entities/notification.entity';
import { NotificationDataMap } from '../types/notification-data.type';

export class CreateNotificationDto<
  T extends NotificationType = NotificationType,
> {
  userId: string;

  @ApiProperty()
  type: T;

  @ApiProperty()
  data: NotificationDataMap[T];
}
