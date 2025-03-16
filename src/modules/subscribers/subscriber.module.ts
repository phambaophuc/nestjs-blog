import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '@utils/nodemailer/email.module';

import { SubscriberController } from './controllers/subscriber.controller';
import { SubscriberEntity } from './entities/subscriber.entity';
import { SubscriberRepository } from './repositories/subscribers.repository';
import { SubscribersService } from './services/subscribers.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriberEntity]), EmailModule],
  providers: [SubscriberRepository, SubscribersService],
  controllers: [SubscriberController],
  exports: [SubscribersService],
})
export class SubscriberModule {}
