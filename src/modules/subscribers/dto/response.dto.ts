import { ApiProperty } from '@nestjs/swagger';

import { SubscriberEntity } from '../../../entity/subscriber.entity';

export class SubscriberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  static fromEntity(subscriber: SubscriberEntity): SubscriberResponseDto {
    return {
      id: subscriber.id,
      email: subscriber.email,
    };
  }

  static fromEntities(
    subscribers: SubscriberEntity[],
  ): SubscriberResponseDto[] {
    return subscribers.map((subscriber) =>
      SubscriberResponseDto.fromEntity(subscriber),
    );
  }
}
