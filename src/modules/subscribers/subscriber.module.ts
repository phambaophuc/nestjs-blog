import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriberEntity } from '@/entities';
import { EmailModule } from '@/shared';

import { SubscriberController } from './subscriber.controller';
import { SubscriberRepository } from './subscribers.repository';
import { SubscribersService } from './subscribers.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriberEntity]), EmailModule],
  providers: [SubscriberRepository, SubscribersService],
  controllers: [SubscriberController],
  exports: [SubscribersService],
})
export class SubscriberModule {}
